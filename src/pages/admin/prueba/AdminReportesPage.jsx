import React, { useState, useEffect } from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { FileText, Printer, Download, ArrowLeft, Loader2 } from "lucide-react"
import { getReportesConfig, generarReporte } from "../../../services/reports.services"
import "../../styles/styles_admin/AdminReportesPage.css"

// Metadata local de cómo renderizar cada filtro conocido: tipo de input y, si aplica,
// las opciones fijas (vienen de los CHECK constraints del schema, no cambian seguido).
// Si el backend agrega un filtro nuevo que no está acá, cae al default: input de texto libre.
const FILTROS_META = {
  estado_ejemplar: {
    label: "Estado del ejemplar", type: "select",
    options: ["disponible", "prestado", "reservado", "eliminado", "inhabilitado", "deteriorado", "perdido", "solicitado"]
  },
  tipo_material: { label: "Tipo de material", type: "text" },
  carrera: { label: "Carrera", type: "text" },
  id_libro: { label: "ID de libro", type: "number" },
  id_usuario: { label: "ID de usuario", type: "number" },
  estado_prestamo: {
    label: "Estado del préstamo", type: "select",
    options: ["solicitado", "aprobado", "parcialmente_aprobado", "rechazado", "cancelado", "activo", "devuelto",
      "vencido", "pendiente_devolucion", "solicitud_renovacion", "renovado", "renovacion_finalizada",
      "cerrado_con_perdida", "solicitud_reserva", "reserva_aprobada", "reserva_parcialmente_aprobada", "reserva_rechazada"]
  },
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

export default function AdminReportesPage() {
  const [entidades, setEntidades] = useState([])
  const [cargandoConfig, setCargandoConfig] = useState(true)

  const [entidadKey, setEntidadKey] = useState(null)
  const [columnasSeleccionadas, setColumnasSeleccionadas] = useState([])
  const [filtros, setFiltros] = useState({})

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

  const handleElegirEntidad = (entidad) => {
    setEntidadKey(entidad.key)
    setColumnasSeleccionadas(entidad.columnas.map(c => c.key)) // todas seleccionadas por defecto
    setFiltros({})
    setReporte(null)
    setError(null)
  }

  const handleVolver = () => {
    setEntidadKey(null)
    setColumnasSeleccionadas([])
    setFiltros({})
    setReporte(null)
    setError(null)
  }

  const toggleColumna = (key) => {
    setColumnasSeleccionadas(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    )
  }

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
      const resultado = await generarReporte(entidadKey, columnasSeleccionadas, filtros)
      setReporte(resultado)
    } catch (err) {
      console.error("Error al generar reporte:", err)
      setError(err.response?.data?.error || "Ocurrió un error al generar el reporte.")
    } finally {
      setGenerando(false)
    }
  }

  const handleNuevaBusqueda = () => {
    setReporte(null)
  }

  // Convierte cualquier valor de celda a texto legible para la tabla/PDF
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
    if (filtrosTexto) {
      doc.text(`Filtros: ${filtrosTexto}`, 14, 26)
    }

    autoTable(doc, {
      startY: filtrosTexto ? 31 : 26,
      head: [reporte.data.columnas.map(c => c.label)],
      body: reporte.data.filas.map(fila =>
        reporte.data.columnas.map(c => formatearCelda(fila[c.key]))
      ),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [30, 41, 59] }, // #1e293b, mismo tono de panel que el resto del admin
      alternateRowStyles: { fillColor: [245, 245, 245] }
    })

    doc.save(`reporte_${entidadKey}_${Date.now()}.pdf`)
  }

  const handleImprimir = () => {
    window.print()
  }

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

        {/* PASO 1: elegir entidad */}
        {!entidadKey && (
          <div className="reportes-entidades">
            {entidades.map(entidad => (
              <button
                key={entidad.key}
                className="reportes-entidad-card"
                onClick={() => handleElegirEntidad(entidad)}
              >
                <FileText size={22} />
                <span>{entidad.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* PASO 2: configurar columnas + filtros */}
        {entidadKey && !reporte && (
          <div className="reportes-config no-print">
            <button className="reportes-btn-volver" onClick={handleVolver}>
              <ArrowLeft size={16} /> Cambiar tipo de reporte
            </button>

            <h2 className="reportes-subtitulo">{entidadActual.label}</h2>

            <div className="reportes-seccion">
              <h3>Columnas a incluir</h3>
              <div className="reportes-chips">
                {entidadActual.columnas.map(col => (
                  <span
                    key={col.key}
                    className={`chip ${columnasSeleccionadas.includes(col.key) ? "active" : ""}`}
                    onClick={() => toggleColumna(col.key)}
                  >
                    {col.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="reportes-seccion">
              <h3>Filtros</h3>
              <div className="reportes-filtros-grid">
                {entidadActual.filtros.map(filtroKey => {
                  const meta = FILTROS_META[filtroKey] || { label: filtroKey, type: "text" }
                  return (
                    <div className="reportes-filtro-item" key={filtroKey}>
                      <label>{meta.label}</label>
                      {meta.type === "select" ? (
                        <select
                          value={filtros[filtroKey] || ""}
                          onChange={(e) => handleFiltroChange(filtroKey, e.target.value)}
                        >
                          <option value="">Todos</option>
                          {meta.options.map(op => (
                            <option key={op} value={op}>{op}</option>
                          ))}
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

            <button className="reportes-btn-generar" onClick={handleGenerar} disabled={generando}>
              {generando ? <Loader2 className="spin" size={16} /> : <FileText size={16} />}
              {generando ? "Generando..." : "Generar reporte"}
            </button>
          </div>
        )}

        {/* PASO 3: resultado */}
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
                    <tr>
                      {reporte.data.columnas.map(col => (
                        <th key={col.key}>{col.label}</th>
                      ))}
                    </tr>
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
                          {reporte.data.columnas.map(col => (
                            <td key={col.key}>{formatearCelda(fila[col.key])}</td>
                          ))}
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