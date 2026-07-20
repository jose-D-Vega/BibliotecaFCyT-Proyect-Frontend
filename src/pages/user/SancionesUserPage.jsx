import React, { useState, useMemo, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { AlertTriangle, Clock, CheckCircle2, FileWarning, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowLeft } from "lucide-react"
import "./styles/SancionesUserPage.css"

const ITEMS_POR_PAGINA = 5

export default function MisSanciones() {
  const [sanciones, setSanciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorCarga, setErrorCarga] = useState(false)
  const [filtroEstado, setFiltroEstado] = useState("Todas")
  const [paginaActual, setPaginaActual] = useState(1)

  const location = useLocation()
  const navigate = useNavigate()
  const vieneDelDashboard = !!location.state?.fromDashboard

  const API_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/sanctions`
    : "http://localhost:3210/api/sanctions"

  const token = localStorage.getItem("token")

  const headers = useMemo(() => ({
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }), [token])

  // CARGAR SANCIONES DEL USUARIO
  useEffect(() => {
    const cargarSanciones = async () => {
      try {
        const res = await fetch(`${API_URL}/mis-sanciones`, { headers })
        const json = await res.json()

        if (!res.ok) {
          setErrorCarga(true)
          setSanciones([])
        } else {
          setSanciones(Array.isArray(json.data) ? json.data : [])
        }
      } catch (err) {
        console.error("Error al cargar sanciones:", err)
        setErrorCarga(true)
      } finally {
        setLoading(false)
      }
    }
    cargarSanciones()
  }, [headers])

  // ESTADÍSTICAS
  const estadisticas = useMemo(() => {
    const normalizar = (estado) => (estado || "").toLowerCase()
    return {
      total: sanciones.length,
      activas: sanciones.filter(s => normalizar(s.estado_sancion) === "activa").length,
      resueltas: sanciones.filter(s => normalizar(s.estado_sancion) === "resuelta").length,
      pendientes: sanciones.filter(s => normalizar(s.estado_sancion).includes("pendiente")).length
    }
  }, [sanciones])

  // FILTRADO
  const sancionesFiltradas = useMemo(() => {
    let lista = [...sanciones]
    const normalizar = (estado) => (estado || "").toLowerCase()

    if (filtroEstado === "Activas") {
      lista = lista.filter(s => normalizar(s.estado_sancion) === "activa")
    } else if (filtroEstado === "Resueltas") {
      lista = lista.filter(s => normalizar(s.estado_sancion) === "resuelta")
    } else if (filtroEstado === "Pendientes") {
      lista = lista.filter(s => normalizar(s.estado_sancion).includes("pendiente"))
    }

    return lista
  }, [sanciones, filtroEstado])

  // Resetear a página 1 cada vez que cambia el filtro
  useEffect(() => {
    setPaginaActual(1)
  }, [filtroEstado])

  // PAGINACIÓN
  const totalPaginas = Math.max(1, Math.ceil(sancionesFiltradas.length / ITEMS_POR_PAGINA))

  const sancionesPaginadas = useMemo(() => {
    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA
    return sancionesFiltradas.slice(inicio, inicio + ITEMS_POR_PAGINA)
  }, [sancionesFiltradas, paginaActual])

  const irAPagina = (n) => {
    if (n < 1 || n > totalPaginas) return
    setPaginaActual(n)
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return "—"
    const date = new Date(fecha)
    if (Number.isNaN(date.getTime())) return fecha
    return date.toLocaleDateString("es-PY", { year: "numeric", month: "short", day: "numeric" })
  }

  // TIEMPO RELATIVO — "Hace X minutos/horas/días"
  const formatearTiempoRelativo = (fecha) => {
    if (!fecha) return null
    const date = new Date(fecha)
    if (Number.isNaN(date.getTime())) return null

    const ahora = new Date()
    const diffMs = ahora - date
    const diffMin = Math.floor(diffMs / (1000 * 60))
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMin < 1) return "Justo ahora"
    if (diffMin < 60) return `Hace ${diffMin} minuto${diffMin === 1 ? "" : "s"}`
    if (diffHoras < 24) return `Hace ${diffHoras} hora${diffHoras === 1 ? "" : "s"}`
    if (diffDias < 30) return `Hace ${diffDias} día${diffDias === 1 ? "" : "s"}`
    return formatearFecha(fecha)
  }

  const formatearTipoInfraccion = (tipo) => {
    if (!tipo) return "Sin especificar"
    return tipo
      .split("_")
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ")
  }

  const getEstadoInfo = (estado) => {
    const e = (estado || "").toLowerCase()
    if (e === "activa") {
      return { texto: "Activa", clase: "san-estado-activa", icono: <AlertTriangle size={14} /> }
    }
    if (e === "resuelta") {
      return { texto: "Resuelta", clase: "san-estado-resuelta", icono: <CheckCircle2 size={14} /> }
    }
    if (e.includes("pendiente")) {
      return { texto: "Pendiente de confirmación", clase: "san-estado-pendiente", icono: <Clock size={14} /> }
    }
    return { texto: estado || "Sin estado", clase: "san-estado-default", icono: <FileWarning size={14} /> }
  }

  if (loading) {
    return (
      <div className="san-contenedor">
        <div className="san-loader">
          <div className="san-spinner"></div>
          <p>Cargando tus sanciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="san-contenedor">
      <main className="san-contenido">
        <div className="san-header">
          <div>
            {vieneDelDashboard && (
              <button
                className="san-volver-btn"
                onClick={() => navigate('/app/inicio')}
              >
                <ArrowLeft size={16} /> Volver al inicio
              </button>
            )}
            <h1>Mis Sanciones</h1>
            <p>Aquí podés ver el historial y el estado de tus sanciones.</p>
          </div>
        </div>

        {/* TARJETAS DE RESUMEN (funcionan como filtro) */}
        <div className="san-tarjetas-resumen">
          <div
            className={`san-tarjeta-kpi san-tarjeta-kpi-total ${filtroEstado === "Todas" ? "active" : ""}`}
            onClick={() => setFiltroEstado("Todas")}
          >
            <div className="san-tarjeta-kpi-icono"><FileWarning size={20} /></div>
            <div className="san-tarjeta-kpi-info">
              <span className="san-tarjeta-kpi-label">Total Sanciones</span>
              <h2 className="san-tarjeta-kpi-valor">{estadisticas.total}</h2>
            </div>
          </div>

          <div
            className={`san-tarjeta-kpi san-tarjeta-kpi-activas ${filtroEstado === "Activas" ? "active" : ""}`}
            onClick={() => setFiltroEstado("Activas")}
          >
            <div className="san-tarjeta-kpi-icono"><AlertTriangle size={20} /></div>
            <div className="san-tarjeta-kpi-info">
              <span className="san-tarjeta-kpi-label">Activas</span>
              <h2 className="san-tarjeta-kpi-valor">{estadisticas.activas}</h2>
            </div>
          </div>

          <div
            className={`san-tarjeta-kpi san-tarjeta-kpi-pendientes ${filtroEstado === "Pendientes" ? "active" : ""}`}
            onClick={() => setFiltroEstado("Pendientes")}
          >
            <div className="san-tarjeta-kpi-icono"><Clock size={20} /></div>
            <div className="san-tarjeta-kpi-info">
              <span className="san-tarjeta-kpi-label">Pendientes</span>
              <h2 className="san-tarjeta-kpi-valor">{estadisticas.pendientes}</h2>
            </div>
          </div>

          <div
            className={`san-tarjeta-kpi san-tarjeta-kpi-resueltas ${filtroEstado === "Resueltas" ? "active" : ""}`}
            onClick={() => setFiltroEstado("Resueltas")}
          >
            <div className="san-tarjeta-kpi-icono"><CheckCircle2 size={20} /></div>
            <div className="san-tarjeta-kpi-info">
              <span className="san-tarjeta-kpi-label">Resueltas</span>
              <h2 className="san-tarjeta-kpi-valor">{estadisticas.resueltas}</h2>
            </div>
          </div>
        </div>

        {/* LISTADO DE SANCIONES */}
        <div className="san-lista">
          {errorCarga ? (
            <div className="san-sin-resultados">
              No se pudieron cargar tus sanciones. Intentá nuevamente más tarde.
            </div>
          ) : sancionesFiltradas.length === 0 ? (
            <div className="san-sin-resultados">
              {filtroEstado === "Todas"
                ? "No tenés sanciones registradas."
                : "No tenés sanciones en esta categoría."}
            </div>
          ) : (
            sancionesPaginadas.map((sancion) => {
              const estadoInfo = getEstadoInfo(sancion.estado_sancion)
              return (
                <div key={sancion.id_sancion} className="san-card">
                  <div className="san-card-header">
                    <div className="san-card-titulo">
                      <span className="san-card-tipo">{formatearTipoInfraccion(sancion.tipo_infraccion)}</span>
                      {sancion.titulo_material && (
                        <span className="san-card-material">
                          {sancion.titulo_material}
                          {sancion.autor_material && ` — ${sancion.autor_material}`}
                        </span>
                      )}
                    </div>
                    <div className="san-card-header-derecha">
                      <span className="san-tiempo-relativo">{formatearTiempoRelativo(sancion.fecha_sancion)}</span>
                      <span className={`san-badge ${estadoInfo.clase}`}>
                        {estadoInfo.icono}
                        {estadoInfo.texto}
                      </span>
                    </div>
                  </div>

                  {sancion.descripcion_sancion && (
                    <p className="san-card-descripcion">{sancion.descripcion_sancion}</p>
                  )}

                  <div className="san-card-detalles">
                    {sancion.editorial_material && (
                      <div className="san-detalle">
                        <span className="san-detalle-label">Editorial</span>
                        <span className="san-detalle-valor">{sancion.editorial_material}</span>
                      </div>
                    )}

                    {sancion.id_ejemplar && (
                      <div className="san-detalle">
                        <span className="san-detalle-label">Ejemplar N°</span>
                        <span className="san-detalle-valor">{sancion.id_ejemplar}</span>
                      </div>
                    )}

                    {sancion.estado_ejemplar && (
                      <div className="san-detalle">
                        <span className="san-detalle-label">Estado del ejemplar</span>
                        <span className="san-detalle-valor">{formatearTipoInfraccion(sancion.estado_ejemplar)}</span>
                      </div>
                    )}

                    {sancion.estado_prestamo && (
                      <div className="san-detalle">
                        <span className="san-detalle-label">Estado del préstamo</span>
                        <span className="san-detalle-valor">{formatearTipoInfraccion(sancion.estado_prestamo)}</span>
                      </div>
                    )}

                    <div className="san-detalle">
                      <span className="san-detalle-label">Fecha de sanción</span>
                      <span className="san-detalle-valor">{formatearFecha(sancion.fecha_sancion)}</span>
                    </div>

                    {sancion.fecha_tope_devolucion && (
                      <div className="san-detalle">
                        <span className="san-detalle-label">Fecha tope de devolución</span>
                        <span className="san-detalle-valor">{formatearFecha(sancion.fecha_tope_devolucion)}</span>
                      </div>
                    )}

                    {sancion.fecha_limite && (
                      <div className="san-detalle">
                        <span className="san-detalle-label">Fecha límite</span>
                        <span className="san-detalle-valor">{formatearFecha(sancion.fecha_limite)}</span>
                      </div>
                    )}

                    {sancion.dias_suspension !== null && sancion.dias_suspension !== undefined && (
                      <div className="san-detalle">
                        <span className="san-detalle-label">Días de suspensión</span>
                        <span className="san-detalle-valor">{sancion.dias_suspension}</span>
                      </div>
                    )}

                    {sancion.fecha_fin_suspension && (
                      <div className="san-detalle">
                        <span className="san-detalle-label">Fin de suspensión</span>
                        <span className="san-detalle-valor">{formatearFecha(sancion.fecha_fin_suspension)}</span>
                      </div>
                    )}

                    {sancion.admin_nombre && (
                      <div className="san-detalle">
                        <span className="san-detalle-label">Gestionado por</span>
                        <span className="san-detalle-valor">{sancion.admin_nombre}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* PAGINACIÓN */}
        {sancionesFiltradas.length > ITEMS_POR_PAGINA && (
          <div className="san-paginacion">
            <button
              className="san-pagina-btn"
              onClick={() => irAPagina(1)}
              disabled={paginaActual === 1}
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              className="san-pagina-btn"
              onClick={() => irAPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`san-pagina-btn ${paginaActual === num ? "active" : ""}`}
                onClick={() => irAPagina(num)}
              >
                {num}
              </button>
            ))}

            <button
              className="san-pagina-btn"
              onClick={() => irAPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
            >
              <ChevronRight size={16} />
            </button>
            <button
              className="san-pagina-btn"
              onClick={() => irAPagina(totalPaginas)}
              disabled={paginaActual === totalPaginas}
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}