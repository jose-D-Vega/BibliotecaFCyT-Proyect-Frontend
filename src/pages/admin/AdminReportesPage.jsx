import React, { useState, useEffect, useRef, useMemo } from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { FileText, Printer, Download, ArrowLeft, Loader2, Search, X, Check } from "lucide-react"
import { getReportesConfig, generarReporte, buscarUsuarios } from "../../services/reports.services"
import "../styles/styles_admin/AdminReportesPage.css"

const FILTROS_META = {
  estado_ejemplar: {
    label: "Estado del ejemplar", type: "select",
    options: ["disponible", "prestado", "reservado", "eliminado", "inhabilitado", "deteriorado", "perdido", "solicitado"]
  },
  tipo_material: { label: "Tipo de material", type: "text" },
  carrera: { label: "Carrera", type: "text" },
  facultad: { label: "Facultad", type: "text" },
  id_libro: { label: "ID de libro", type: "number" },
  anio_desde: { label: "Año desde", type: "number" },
  anio_hasta: { label: "Año hasta", type: "number" },
  id_usuario: { label: "Usuario", type: "usuario_search" },
  id_prestamo: { label: "N° de préstamo", type: "number" },
  estado_prestamo: {
    label: "Estado del préstamo", type: "select",
    options: ["solicitado", "aprobado", "parcialmente_aprobado", "rechazado", "cancelado", "activo", "devuelto",
      "vencido", "pendiente_devolucion", "solicitud_renovacion", "renovado", "renovacion_finalizada",
      "cerrado_con_perdida", "solicitud_reserva", "reserva_aprobada", "reserva_parcialmente_aprobada", "reserva_rechazada"]
  },
  estado_prestamo_ejemplar: {
    label: "Estado del ítem", type: "select",
    options: ["solicitado", "aprobado", "rechazado", "activo", "devuelto", "cancelado", "perdido", "reemplazado"]
  },
  estado_devuelto: { label: "Estado al devolver", type: "select", options: ["bueno", "deteriorado", "danado"] },
  es_reserva: { label: "¿Es reserva?", type: "select", options: ["true", "false"] },
  fecha_desde: { label: "Desde", type: "date" },
  fecha_hasta: { label: "Hasta", type: "date" },
  tipo_infraccion: {
    label: "Tipo de infracción", type: "select",
    options: ["falta_entrega", "devolucion_tardia", "deterioro", "perdida", "comportamiento"]
  },
  estado_sancion: {
    label: "Estado de la sanción", type: "select",
    options: ["pendiente_confirmacion", "activa", "rechazada", "resuelta", "escalada"]
  },
  rol: { label: "Rol", type: "select", options: ["admin", "bibliotecario", "normal"] },
  activo: { label: "¿Activo?", type: "select", options: ["true", "false"] },
  sancionado: { label: "¿Sancionado?", type: "select", options: ["true", "false"] }
}

// Buscador de usuario con autocompletar: evita tener que escribir el ID a mano.
function BuscadorUsuarioFiltro({ value, onChange }) {
  const [query, setQuery] = useState("")
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [mostrarLista, setMostrarLista] = useState(false)
  const [seleccionado, setSeleccionado] = useState(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (!value) setSeleccionado(null)
  }, [value])

  const handleQueryChange = (texto) => {
    setQuery(texto)
    setMostrarLista(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (texto.trim().length < 2) {
      setResultados([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setBuscando(true)
      try {
        const data = await buscarUsuarios(texto.trim())
        setResultados(data)
      } catch (err) {
        console.error("Error al buscar usuarios:", err)
      } finally {
        setBuscando(false)
      }
    }, 350)
  }

  const handleSeleccionar = (usuario) => {
    setSeleccionado(usuario)
    setQuery("")
    setMostrarLista(false)
    setResultados([])
    onChange(String(usuario.id_usuario))
  }

  const handleQuitar = () => {
    setSeleccionado(null)
    onChange("")
  }

  if (seleccionado) {
    return (
      <div className="usuario-search-seleccionado">
        <span>{seleccionado.nombre_apellido} — {seleccionado.correo}</span>
        <button type="button" onClick={handleQuitar} title="Quitar filtro de usuario">
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <div className="usuario-search-wrapper">
      <div className="usuario-search-input">
        <Search size={14} />
        <input
          type="text"
          placeholder="Nombre, correo o CI..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => setMostrarLista(true)}
        />
      </div>
      {mostrarLista && (query.trim().length >= 2) && (
        <div className="usuario-search-dropdown">
          {buscando && <div className="usuario-search-item usuario-search-vacio">Buscando...</div>}
          {!buscando && resultados.length === 0 && (
            <div className="usuario-search-item usuario-search-vacio">Sin coincidencias</div>
          )}
          {!buscando && resultados.map(u => (
            <div key={u.id_usuario} className="usuario-search-item" onClick={() => handleSeleccionar(u)}>
              <span className="usuario-search-nombre">{u.nombre_apellido}</span>
              <span className="usuario-search-detalle">{u.correo} · CI {u.ci}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminReportesPage() {
  const [entidades, setEntidades] = useState([])
  const [cargandoConfig, setCargandoConfig] = useState(true)

  const [entidadKey, setEntidadKey] = useState(null)
  const [extensionesActivas, setExtensionesActivas] = useState([])
  const [columnasSeleccionadas, setColumnasSeleccionadas] = useState([])
  const [filtros, setFiltros] = useState({})
  const [orden, setOrden] = useState({ columna: "", direccion: "ASC" })

  const [reporte, setReporte] = useState(null)
  const [generando, setGenerando] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarConfig = async () => {
      try {
        const data = await getReportesConfig()
        setEntidades(data)
      } catch (err) {
        console.error("Error al cargar configuración de reportes:", err)
        setError("No se pudo cargar la configuración de reportes.")
      } finally {
        setCargandoConfig(false)
      }
    }
    cargarConfig()
  }, [])

  const entidadActual = entidades.find(e => e.key === entidadKey)

  // Columnas/filtros disponibles = los base de la entidad + los de extensiones activas
  const columnasDisponibles = useMemo(() => {
    if (!entidadActual) return []
    let cols = [...entidadActual.columnas]
    for (const extKey of extensionesActivas) {
      const ext = entidadActual.extensiones.find(e => e.key === extKey)
      if (ext) cols = [...cols, ...ext.columnas]
    }
    return cols
  }, [entidadActual, extensionesActivas])

  const filtrosDisponibles = useMemo(() => {
    if (!entidadActual) return []
    let filtrosKeys = [...entidadActual.filtros]
    for (const extKey of extensionesActivas) {
      const ext = entidadActual.extensiones.find(e => e.key === extKey)
      if (ext) filtrosKeys = [...filtrosKeys, ...ext.filtros]
    }
    return filtrosKeys
  }, [entidadActual, extensionesActivas])

  const handleElegirEntidad = (entidad) => {
    setEntidadKey(entidad.key)
    setExtensionesActivas([])
    setColumnasSeleccionadas(entidad.columnas.map(c => c.key))
    setFiltros({})
    setOrden({ columna: "", direccion: "ASC" })
    setReporte(null)
    setError(null)
  }

  const handleVolver = () => {
    setEntidadKey(null)
    setExtensionesActivas([])
    setColumnasSeleccionadas([])
    setFiltros({})
    setOrden({ columna: "", direccion: "ASC" })
    setReporte(null)
    setError(null)
  }

  const toggleExtension = (ext) => {
    const activa = extensionesActivas.includes(ext.key)
    if (activa) {
      setExtensionesActivas(prev => prev.filter(e => e !== ext.key))
      const keysExt = ext.columnas.map(c => c.key)
      setColumnasSeleccionadas(prev => prev.filter(c => !keysExt.includes(c)))
      setFiltros(prev => {
        const nuevo = { ...prev }
        ext.filtros.forEach(f => delete nuevo[f])
        return nuevo
      })
    } else {
      setExtensionesActivas(prev => [...prev, ext.key])
      setColumnasSeleccionadas(prev => [...prev, ...ext.columnas.map(c => c.key)])
    }
  }

  const toggleColumna = (key) => {
    setColumnasSeleccionadas(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    )
  }

  const handleSeleccionarTodas = () => setColumnasSeleccionadas(columnasDisponibles.map(c => c.key))
  const handleDeseleccionarTodas = () => setColumnasSeleccionadas([])

  const handleFiltroChange = (key, value) => {
    setFiltros(prev => ({ ...prev, [key]: value }))
  }

  const handleGenerar = async () => {
    if (columnasSeleccionadas.length === 0) {
      setError("Seleccioná al menos una columna para el reporte.")
      return
    }
    setGenerando(true)
    setError(null)
    try {
      const resultado = await generarReporte(
        entidadKey,
        columnasSeleccionadas,
        filtros,
        extensionesActivas,
        orden.columna ? orden : null
      )
      setReporte(resultado)
    } catch (err) {
      console.error("Error al generar reporte:", err)
      setError(err.response?.data?.error || "Ocurrió un error al generar el reporte.")
    } finally {
      setGenerando(false)
    }
  }

  const handleNuevaBusqueda = () => setReporte(null)

  const formatearCelda = (valor) => {
    if (valor === null || valor === undefined) return "-"
    if (typeof valor === "boolean") return valor ? "Sí" : "No"
    if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}/.test(valor)) {
      const fecha = new Date(valor)
      return isNaN(fecha) ? valor : fecha.toLocaleDateString("es-PY")
    }
    return String(valor)
  }

  const handleExportarPDF = () => {
    if (!reporte) return
    const doc = new jsPDF()

    doc.setFontSize(14)
    doc.text(`Reporte: ${entidadActual.label}`, 14, 15)

    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text(`Generado el ${new Date(reporte.metadata.fecha_generado).toLocaleString("es-PY")}`, 14, 21)

    const filtrosTexto = Object.entries(reporte.metadata.filtros_aplicados || {})
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => `${FILTROS_META[k]?.label || k}: ${v}`)
      .join("  |  ")
    if (filtrosTexto) doc.text(`Filtros: ${filtrosTexto}`, 14, 26)

    autoTable(doc, {
      startY: filtrosTexto ? 31 : 26,
      head: [reporte.data.columnas.map(c => c.label)],
      body: reporte.data.filas.map(fila =>
        reporte.data.columnas.map(c => formatearCelda(fila[c.key]))
      ),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [30, 41, 59] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    })

    doc.save(`reporte_${entidadKey}_${Date.now()}.pdf`)
  }

  const handleImprimir = () => window.print()

  if (cargandoConfig) {
    return (
      <div className="contenedor-reportes">
        <p className="reportes-cargando"><Loader2 className="spin" size={18} /> Cargando módulo de reportes...</p>
      </div>
    )
  }

  return (
    <div className="contenedor-reportes">
      <main className="contenido">
        <div className="header">
          <div>
            <h1>Reportes</h1>
            <p>Generá listados personalizados del sistema para auditoría, impresión o exportación a PDF.</p>
          </div>
        </div>

        {error && <div className="reportes-error">{error}</div>}

        {!entidadKey && (
          <div className="reportes-entidades">
            {entidades.map(entidad => (
              <button key={entidad.key} className="reportes-entidad-card" onClick={() => handleElegirEntidad(entidad)}>
                <FileText size={22} />
                <span>{entidad.label}</span>
              </button>
            ))}
          </div>
        )}

        {entidadKey && !reporte && (
          <div className="reportes-config no-print">
            <button className="reportes-btn-volver" onClick={handleVolver}>
              <ArrowLeft size={16} /> Cambiar tipo de reporte
            </button>

            <h2 className="reportes-subtitulo">{entidadActual.label}</h2>

            {entidadActual.extensiones.length > 0 && (
              <div className="reportes-seccion">
                <h3>Combinar con</h3>
                <div className="reportes-checkbox-grupo">
                  {entidadActual.extensiones.map(ext => (
                    <label key={ext.key} className="reportes-checkbox-item">
                      <input
                        type="checkbox"
                        checked={extensionesActivas.includes(ext.key)}
                        onChange={() => toggleExtension(ext)}
                      />
                      {ext.label}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="reportes-seccion">
              <div className="reportes-seccion-titulo-con-acciones">
                <h3>Columnas a incluir ({columnasSeleccionadas.length} de {columnasDisponibles.length})</h3>
                <div className="reportes-seleccion-rapida">
                  <button type="button" onClick={handleSeleccionarTodas}>Todas</button>
                  <button type="button" onClick={handleDeseleccionarTodas}>Ninguna</button>
                </div>
              </div>
              <p className="reportes-hint">Tildá las columnas que querés ver en el reporte final.</p>
              <div className="reportes-checkbox-grupo">
                {columnasDisponibles.map(col => (
                  <label key={col.key} className="reportes-checkbox-item">
                    <input
                      type="checkbox"
                      checked={columnasSeleccionadas.includes(col.key)}
                      onChange={() => toggleColumna(col.key)}
                    />
                    {col.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="reportes-seccion">
              <h3>Filtros</h3>
              <div className="reportes-filtros-grid">
                {filtrosDisponibles.map(filtroKey => {
                  const meta = FILTROS_META[filtroKey] || { label: filtroKey, type: "text" }
                  return (
                    <div className="reportes-filtro-item" key={filtroKey}>
                      <label>{meta.label}</label>
                      {meta.type === "usuario_search" ? (
                        <BuscadorUsuarioFiltro
                          value={filtros[filtroKey]}
                          onChange={(id) => handleFiltroChange(filtroKey, id)}
                        />
                      ) : meta.type === "select" ? (
                        <select value={filtros[filtroKey] || ""} onChange={(e) => handleFiltroChange(filtroKey, e.target.value)}>
                          <option value="">Todos</option>
                          {meta.options.map(op => <option key={op} value={op}>{op}</option>)}
                        </select>
                      ) : (
                        <input
                          type={meta.type}
                          value={filtros[filtroKey] || ""}
                          onChange={(e) => handleFiltroChange(filtroKey, e.target.value)}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="reportes-seccion">
              <h3>Ordenar por</h3>
              <div className="reportes-orden-grupo">
                <select
                  value={orden.columna}
                  onChange={(e) => setOrden(prev => ({ ...prev, columna: e.target.value }))}
                >
                  <option value="">(orden por defecto)</option>
                  {columnasDisponibles.map(col => (
                    <option key={col.key} value={col.key}>{col.label}</option>
                  ))}
                </select>
                <select
                  value={orden.direccion}
                  onChange={(e) => setOrden(prev => ({ ...prev, direccion: e.target.value }))}
                  disabled={!orden.columna}
                >
                  <option value="ASC">Ascendente</option>
                  <option value="DESC">Descendente</option>
                </select>
              </div>
            </div>

            <button className="reportes-btn-generar" onClick={handleGenerar} disabled={generando}>
              {generando ? <Loader2 className="spin" size={16} /> : <Check size={16} />}
              {generando ? "Generando..." : "Generar reporte"}
            </button>
          </div>
        )}

        {reporte && (
          <div className="reportes-resultado">
            <div className="reportes-resultado-header no-print">
              <button className="reportes-btn-volver" onClick={handleNuevaBusqueda}>
                <ArrowLeft size={16} /> Nueva búsqueda
              </button>
              <div className="reportes-acciones">
                <button className="reportes-btn-accion" onClick={handleImprimir}>
                  <Printer size={16} /> Imprimir
                </button>
                <button className="reportes-btn-accion reportes-btn-pdf" onClick={handleExportarPDF}>
                  <Download size={16} /> Exportar PDF
                </button>
              </div>
            </div>

            <div className="reportes-imprimible">
              <h2>{entidadActual.label}</h2>
              <p className="reportes-meta-info">
                Generado el {new Date(reporte.metadata.fecha_generado).toLocaleString("es-PY")}
                {" — "}{reporte.data.filas.length} resultado(s)
              </p>

              <div className="tabla-contenedor">
                <table>
                  <thead>
                    <tr>{reporte.data.columnas.map(col => <th key={col.key}>{col.label}</th>)}</tr>
                  </thead>
                  <tbody>
                    {reporte.data.filas.length === 0 ? (
                      <tr>
                        <td colSpan={reporte.data.columnas.length} className="sin-resultados">
                          No se encontraron resultados con los filtros aplicados.
                        </td>
                      </tr>
                    ) : (
                      reporte.data.filas.map((fila, i) => (
                        <tr key={i}>
                          {reporte.data.columnas.map(col => <td key={col.key}>{formatearCelda(fila[col.key])}</td>)}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}