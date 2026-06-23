import React, { useState, useMemo, useEffect } from "react"
import { AlertTriangle, Clock, CheckCircle2, FileWarning } from "lucide-react"
import "../styles/styles_user/SancionesUserPage.css"

export default function MisSanciones() {
  const [sanciones, setSanciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorCarga, setErrorCarga] = useState(false)
  const [filtroEstado, setFiltroEstado] = useState("Todas")

  const API_URL = "http://localhost:3210/api/sanciones"
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

  const chips = ["Todas", "Activas", "Resueltas", "Pendientes"]

  // ESTADÍSTICAS
  const estadisticas = useMemo(() => {
    const normalizar = (estado) => (estado || "").toLowerCase()
    return {
      total: sanciones.length,
      activas: sanciones.filter(s => normalizar(s.estado_sancion) === "activa").length,
      resueltas: sanciones.filter(s => normalizar(s.estado_sancion) === "resuelta").length
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

  const formatearFecha = (fecha) => {
    if (!fecha) return "—"
    const date = new Date(fecha)
    if (Number.isNaN(date.getTime())) return fecha
    return date.toLocaleDateString("es-PY", { year: "numeric", month: "short", day: "numeric" })
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
        <p>Cargando tus sanciones...</p>
      </div>
    )
  }

  return (
    <div className="san-contenedor">
      <main className="san-contenido">
        <div className="san-header">
          <div>
            <h1>Mis Sanciones</h1>
            <p>Aquí podés ver el historial y el estado de tus sanciones.</p>
          </div>
        </div>

        {/* TARJETAS DE RESUMEN */}
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

        {/* CHIPS DE FILTRO */}
        <div className="san-toolbar">
          <div className="san-chips">
            {chips.map((chip) => (
              <span
                key={chip}
                className={`san-chip ${filtroEstado === chip ? "active" : ""}`}
                onClick={() => setFiltroEstado(chip)}
              >
                {chip}
              </span>
            ))}
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
            sancionesFiltradas.map((sancion) => {
              const estadoInfo = getEstadoInfo(sancion.estado_sancion)
              return (
                <div key={sancion.id_sancion} className="san-card">
                  <div className="san-card-header">
                    <div className="san-card-titulo">
                      <span className="san-card-tipo">{formatearTipoInfraccion(sancion.tipo_infraccion)}</span>
                      {sancion.titulo_material && (
                        <span className="san-card-material">{sancion.titulo_material}</span>
                      )}
                    </div>
                    <span className={`san-badge ${estadoInfo.clase}`}>
                      {estadoInfo.icono}
                      {estadoInfo.texto}
                    </span>
                  </div>

                  {sancion.descripcion_sancion && (
                    <p className="san-card-descripcion">{sancion.descripcion_sancion}</p>
                  )}

                  <div className="san-card-detalles">
                    <div className="san-detalle">
                      <span className="san-detalle-label">Fecha de sanción</span>
                      <span className="san-detalle-valor">{formatearFecha(sancion.fecha_sancion)}</span>
                    </div>

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
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}