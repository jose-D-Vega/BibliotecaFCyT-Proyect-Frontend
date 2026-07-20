import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react"
import { Loader2, History, ChevronLeft, ChevronRight, ShieldCheck, UserRound, Printer, FileDown } from "lucide-react"
import { getActividades } from "../../services/activity.services"
import { validarCambioFecha } from "../../utils/validarRangoFecha"
import BuscadorUsuarioFiltro from "../../components/reportes/BuscadorUsuarioFiltro"
import "./styles/ActividadesAdminPage.css"
import { exportarReportePDF } from "../../utils/exportarReportePDF"

const TIPOS_ACCION = [
  { value: "crear", label: "Crear" },
  { value: "editar", label: "Editar" },
  { value: "eliminar", label: "Eliminar" },
  { value: "ocultar", label: "Ocultar" },
  { value: "aprobar", label: "Aprobar" },
  { value: "rechazar", label: "Rechazar" },
  { value: "activar", label: "Activar" },
  { value: "cancelar", label: "Cancelar" },
  { value: "devolver", label: "Devolver" },
  { value: "sancionar", label: "Sancionar" },
  { value: "cambio_rol", label: "Cambio de Rol" }
]

const ENTIDADES = [
  { value: "libros", label: "Libros" },
  { value: "ejemplares", label: "Ejemplares" },
  { value: "prestamos", label: "Préstamos" },
  { value: "sanciones", label: "Sanciones" },
  { value: "usuarios", label: "Usuarios" }
]

const VISTAS = {
  funcionarios: {
    buscadorLabel: "Funcionario",
    buscadorPlaceholder: "Nombre, correo o CI del funcionario...",
    soloStaff: true
  },
  usuarios: {
    buscadorLabel: "Usuario",
    buscadorPlaceholder: "Nombre, correo o CI del usuario...",
    soloStaff: false
  }
}

const obtenerLabel = (opciones, value) => opciones.find(o => o.value === value)?.label || value

export default function ActividadesAdminPage() {
  const contenedorRef = useRef(null)

  const [vista, setVista] = useState("funcionarios")
  const [resetKey, setResetKey] = useState(0)

  const [actividades, setActividades] = useState([])
  const [paginacion, setPaginacion] = useState({ total: 0, page: 1, totalPages: 1 })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const [tipoAccion, setTipoAccion] = useState("")
  const [entidad, setEntidad] = useState("")
  const [fechaDesde, setFechaDesde] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")
  const [pagina, setPagina] = useState(1)

  const configVista = VISTAS[vista]
  const [limitePagina, setLimitePagina] = useState(10) // arranca conservador, nunca "50 de más"
  const [anchoListo, setAnchoListo] = useState(false)
  const [exportando, setExportando] = useState(false)
  const [actividadesImprimir, setActividadesImprimir] = useState([])

  useLayoutEffect(() => {
    const actualizarLimite = () => {
      if (!contenedorRef.current) return
      const ancho = contenedorRef.current.offsetWidth
      if (ancho === 0) return // aún no tiene layout real, esperamos al próximo disparo

      if (ancho <= 480) setLimitePagina(10)
      else if (ancho <= 768) setLimitePagina(20)
      else setLimitePagina(50)

      setAnchoListo(true)
    }

    actualizarLimite()

    const observer = new ResizeObserver(actualizarLimite)
    observer.observe(contenedorRef.current)

    return () => observer.disconnect()
  }, [])

  // Trae TODAS las actividades que cumplen los filtros actuales, ignorando la paginación
  // de la UI. El backend limita cada request a 200 registros (LIMITE_MAXIMO), así que si hay
  // más, se piden varias páginas de 200 y se concatenan.
  const obtenerTodasLasActividades = async () => {
    const LIMITE_EXPORT = 200
    const filtrosBase = {
      vista,
      id_usuario: usuarioSeleccionado?.id_usuario || "",
      tipo_accion: vista === "funcionarios" ? tipoAccion : "",
      entidad: vista === "funcionarios" ? entidad : "",
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta,
      limit: LIMITE_EXPORT
    }

    const primera = await getActividades({ ...filtrosBase, page: 1 })
    let todas = [...primera.data]
    const totalPaginas = primera.pagination.totalPages

    for (let pagina = 2; pagina <= totalPaginas; pagina++) {
      const siguiente = await getActividades({ ...filtrosBase, page: pagina })
      todas = todas.concat(siguiente.data)
    }

    return todas
  }

  const fetchActividades = useCallback(async (pag, overrides = {}) => {
    setCargando(true)
    setError(null)
    try {
      const base = {
        vista,
        id_usuario: usuarioSeleccionado?.id_usuario || "",
        tipo_accion: vista === "funcionarios" ? tipoAccion : "",
        entidad: vista === "funcionarios" ? entidad : "",
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
        page: pag,
        limit: limitePagina
      }
      const data = await getActividades({ ...base, ...overrides })
      setActividades(data.data)
      setPaginacion(data.pagination)
    } catch (err) {
      console.error("Error al obtener el historial de actividades:", err)
      setError("No se pudo cargar el historial de actividades.")
    } finally {
      setCargando(false)
    }
  }, [vista, usuarioSeleccionado, tipoAccion, entidad, fechaDesde, fechaHasta, limitePagina])

  useEffect(() => {
    if (!anchoListo) return
    fetchActividades(pagina)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, anchoListo])

  useEffect(() => {
    if (!anchoListo) return
    setPagina(1)
    fetchActividades(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limitePagina, anchoListo])

  const handleFiltrar = () => {
    setPagina(1)
    fetchActividades(1)
  }

  const handleLimpiarFiltros = () => {
    setUsuarioSeleccionado(null)
    setTipoAccion("")
    setEntidad("")
    setFechaDesde("")
    setFechaHasta("")
    setPagina(1)
    setResetKey(k => k + 1)
    fetchActividades(1, {
      id_usuario: "",
      tipo_accion: "",
      entidad: "",
      fecha_desde: "",
      fecha_hasta: ""
    })
  }

  const handleCambiarVista = (nuevaVista) => {
    if (nuevaVista === vista) return
    setVista(nuevaVista)
    setUsuarioSeleccionado(null)
    setTipoAccion("")
    setEntidad("")
    setFechaDesde("")
    setFechaHasta("")
    setPagina(1)
    setResetKey(k => k + 1)
    fetchActividades(1, {
      vista: nuevaVista,
      id_usuario: "",
      tipo_accion: "",
      entidad: "",
      fecha_desde: "",
      fecha_hasta: ""
    })
  }

  const handleFechaChange = (campo, valor) => {
    const filtrosActuales = { fecha_desde: fechaDesde, fecha_hasta: fechaHasta }
    const valido = validarCambioFecha(campo === "fecha_desde" ? "fecha_desde" : "fecha_hasta", valor, filtrosActuales)
    if (campo === "fecha_desde") setFechaDesde(valido)
    else setFechaHasta(valido)
  }

  // Da forma a los datos crudos de actividad en el shape que espera exportarReportePDF:
  // { data: { columnas, filas }, metadata: {...} }
  const construirReporteActividades = (listaActividades) => {
    const columnas = [
      { key: "fecha", label: "Fecha" },
      { key: "usuario", label: vista === "funcionarios" ? "Funcionario" : "Usuario" },
      { key: "correo", label: "Correo" },
      { key: "tipo_accion", label: "Acción" },
      { key: "entidad", label: "Entidad" },
      { key: "id_entidad", label: "N° Entidad" },
      { key: "descripcion", label: "Descripción" }
    ]

    const filas = listaActividades.map(a => ({
      ...a,
      tipo_accion: obtenerLabel(TIPOS_ACCION, a.tipo_accion),
      entidad: obtenerLabel(ENTIDADES, a.entidad)
    }))

    return {
      data: { columnas, filas },
      metadata: {
        fecha_generado: new Date().toISOString(),
        filtros_aplicados: {
          vista,
          tipo_accion: tipoAccion || undefined,
          entidad: entidad || undefined,
          fecha_desde: fechaDesde || undefined,
          fecha_hasta: fechaHasta || undefined,
          usuario: usuarioSeleccionado?.nombre_apellido || undefined
        }
      }
    }
  }

  const handleExportarPDF = async () => {
    setExportando(true)
    setError(null)
    try {
      const todas = await obtenerTodasLasActividades()
      const reporte = construirReporteActividades(todas)
      exportarReportePDF(reporte, `Historial de actividades (${vista})`, "historial_actividades")
    } catch (err) {
      console.error("Error al exportar el historial:", err)
      setError("No se pudo exportar el historial a PDF.")
    } finally {
      setExportando(false)
    }
  }

  const handleImprimir = async () => {
    setExportando(true)
    setError(null)
    try {
      const todas = await obtenerTodasLasActividades()
      setActividadesImprimir(todas)
      // Espera al próximo render (con las filas completas ya en el DOM) antes de imprimir
      setTimeout(() => {
        window.print()
        setActividadesImprimir([])
        setExportando(false)
      }, 100)
    } catch (err) {
      console.error("Error al preparar la impresión:", err)
      setError("No se pudo preparar la impresión.")
      setExportando(false)
    }
  }

  return (
    <div className="contenedor-actividades" ref={contenedorRef}>
      <main className="contenido-actividades">
        <div className="actividades-header">
          <div>
            <h1><History size={22} /> Historial de actividades</h1>
            <p>Registro de acciones realizadas por bibliotecarios/administradores y por los usuarios del sistema.</p>
          </div>
          <div className="actividades-header-acciones no-print">
            <button
              type="button"
              className="actividades-btn-accion"
              onClick={handleImprimir}
              disabled={exportando}
            >
              {exportando ? <Loader2 className="spin" size={16} /> : <Printer size={16} />} Imprimir
            </button>
            <button
              type="button"
              className="actividades-btn-accion actividades-btn-pdf"
              onClick={handleExportarPDF}
              disabled={exportando}
            >
              {exportando ? <Loader2 className="spin" size={16} /> : <FileDown size={16} />} Exportar PDF
            </button>
          </div>
        </div>

        <div className="actividades-tabs">
          <button
            type="button"
            className={`actividades-tab ${vista === "funcionarios" ? "activo" : ""}`}
            onClick={() => handleCambiarVista("funcionarios")}
          >
            <ShieldCheck size={16} /> Funcionarios
          </button>
          <button
            type="button"
            className={`actividades-tab ${vista === "usuarios" ? "activo" : ""}`}
            onClick={() => handleCambiarVista("usuarios")}
          >
            <UserRound size={16} /> Usuarios
          </button>
        </div>

        <div className="actividades-filtros">
          <div className="actividades-filtro-item">
            <label>{configVista.buscadorLabel}</label>
            <BuscadorUsuarioFiltro
              key={`${vista}-${resetKey}`}
              usuarioSeleccionado={usuarioSeleccionado}
              onSeleccionar={setUsuarioSeleccionado}
              onQuitar={() => setUsuarioSeleccionado(null)}
              soloStaff={configVista.soloStaff}
              placeholder={configVista.buscadorPlaceholder}
            />
          </div>

          {vista === "funcionarios" && (
            <>
              <div className="actividades-filtro-item">
                <label>Tipo de acción</label>
                <select value={tipoAccion} onChange={(e) => setTipoAccion(e.target.value)}>
                  <option value="">Todas</option>
                  {TIPOS_ACCION.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                </select>
              </div>

              <div className="actividades-filtro-item">
                <label>Entidad</label>
                <select value={entidad} onChange={(e) => setEntidad(e.target.value)}>
                  <option value="">Todas</option>
                  {ENTIDADES.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                </select>
              </div>
            </>
          )}

          <div className="actividades-filtro-item">
            <label>Desde</label>
            <input
              type="date"
              value={fechaDesde}
              max={fechaHasta || new Date().toISOString().split("T")[0]}
              onChange={(e) => handleFechaChange("fecha_desde", e.target.value)}
            />
          </div>

          <div className="actividades-filtro-item">
            <label>Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              min={fechaDesde || undefined}
              onChange={(e) => handleFechaChange("fecha_hasta", e.target.value)}
            />
          </div>

          <div className="actividades-filtro-acciones">
            <button type="button" className="actividades-btn-filtrar" onClick={handleFiltrar}>
              Filtrar
            </button>
            <button type="button" className="actividades-btn-limpiar" onClick={handleLimpiarFiltros}>
              Limpiar
            </button>
          </div>
        </div>

        {error && <div className="actividades-error">{error}</div>}

        <div className="actividades-tabla-contenedor">
          {cargando ? (
            <p className="actividades-cargando"><Loader2 className="spin" size={18} /> Cargando actividades...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>{vista === "funcionarios" ? "Funcionario" : "Usuario"}</th>
                  <th>Correo</th>
                  <th>Acción</th>
                  <th>Entidad</th>
                  <th>N° Entidad</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {actividades.length === 0 && (
                  <tr><td colSpan={7} className="sin-resultados">No se encontraron actividades con estos filtros.</td></tr>
                )}
                {actividades.map(act => (
                  <tr key={act.id_actividad}>
                    <td data-label="Fecha">{new Date(act.fecha).toLocaleString("es-PY")}</td>
                    <td data-label={vista === "funcionarios" ? "Funcionario" : "Usuario"}>{act.usuario}</td>
                    <td data-label="Correo">{act.correo}</td>
                    <td data-label="Acción">{obtenerLabel(TIPOS_ACCION, act.tipo_accion)}</td>
                    <td data-label="Entidad">{obtenerLabel(ENTIDADES, act.entidad)}</td>
                    <td data-label="N° Entidad">{act.id_entidad ?? "-"}</td>
                    <td data-label="Descripción" className="actividades-col-descripcion">{act.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!cargando && paginacion.totalPages > 1 && (
          <div className="actividades-paginacion">
            <button
              type="button"
              disabled={pagina <= 1}
              onClick={() => setPagina(p => p - 1)}
            >
              <ChevronLeft size={16} /> Anterior
            </button>
            <span>Página {paginacion.page} de {paginacion.totalPages} — {paginacion.total} registros</span>
            <button
              type="button"
              disabled={pagina >= paginacion.totalPages}
              onClick={() => setPagina(p => p + 1)}
            >
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        )}
        {/* Tabla oculta en pantalla, visible solo al imprimir — usa el set completo de datos */}
        <div className="actividades-imprimible">
          <h2>Historial de actividades ({vista === "funcionarios" ? "Funcionarios" : "Usuarios"})</h2>
          <p className="actividades-meta-impresion">
            Generado el {new Date().toLocaleString("es-PY")}
          </p>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>{vista === "funcionarios" ? "Funcionario" : "Usuario"}</th>
                <th>Correo</th>
                <th>Acción</th>
                <th>Entidad</th>
                <th>N° Entidad</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {actividadesImprimir.map(act => (
                <tr key={act.id_actividad}>
                  <td>{new Date(act.fecha).toLocaleString("es-PY")}</td>
                  <td>{act.usuario}</td>
                  <td>{act.correo}</td>
                  <td>{obtenerLabel(TIPOS_ACCION, act.tipo_accion)}</td>
                  <td>{obtenerLabel(ENTIDADES, act.entidad)}</td>
                  <td>{act.id_entidad ?? "-"}</td>
                  <td>{act.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}