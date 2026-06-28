import { useEffect, useState } from "react"
import "../styles/styles_admin/PrestamosAdmin.css"

import PrestamoTabs from "../../components/PrestamoTabs"
import PrestamoSolicitudCard from "../../components/PrestamoSolicitudCard"
import PrestamoCard from "../../components/PrestamoCard"
import PrestamoFilters from "../../components/PrestamoFilters"
import PrestamoConfirmModal from "../../components/PrestamoConfirmModal"
import PrestamoPagination from "../../components/PrestamoPagination"
import SolicitudFilters from "../../components/SolicitudFilters"

const API_URL = "http://localhost:3210/api"

function PrestamosAdmin() {

  const [activeTab, setActiveTab] = useState("solicitudes")

  const [solicitudes, setSolicitudes] = useState([])
  const [prestamos, setPrestamos] = useState([])

  const [loading, setLoading] = useState(false)

  // 🔥 NUEVO: control real de carga
  const [loadedSolicitudes, setLoadedSolicitudes] = useState(false)
  const [loadedPrestamos, setLoadedPrestamos] = useState(false)

  const [solicitudFiltro, setSolicitudFiltro] = useState("TODAS")
  const [estadoFiltro, setEstadoFiltro] = useState("Todos los estados")

  const [prestamosPage, setPrestamosPage] = useState(1)
  const [solicitudesPage, setSolicitudesPage] = useState(1)

  const [modal, setModal] = useState({
    open: false,
    action: "",
    solicitud: null
  })

  const normalize = (str) =>
    (str || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()

    const getEmptyMessage = () => {
  const estado = normalize(estadoFiltro)

  if (estado === "TODOS LOS ESTADOS") {
    return "No hay préstamos registrados ahora mismo."
  }

  const map = {
    APROBADO: "No hay préstamos aprobados ahora mismo.",
    PARCIALMENTE_APROBADO: "No hay préstamos parcialmente aprobados ahora mismo.",
    ACTIVO: "No hay préstamos activos ahora mismo.",
    DEVUELTO: "No hay préstamos devueltos ahora mismo.",
    VENCIDO: "No hay préstamos vencidos ahora mismo.",
    RECHAZADO: "No hay préstamos rechazados ahora mismo.",
    RESERVA_APROBADA: "No hay reservas aprobadas ahora mismo.",
    RESERVA_PARCIALMENTE_APROBADA: "No hay reservas parcialmente aprobadas ahora mismo."
  }

  return map[estado] || "No hay préstamos en este estado ahora mismo."
}

  const fetchLoanDetails = async (id, token) => {
    const res = await fetch(`${API_URL}/loans/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    return data?.data
  }

  // =========================
  // PRESTAMOS
  // =========================
  const fetchPrestamos = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")

      const res = await fetch(`${API_URL}/loans?limit=200`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      const list = Array.isArray(data?.data) ? data.data : []

      const ESTADOS_VALIDOS = new Set([
        "aprobado",
        "parcialmente_aprobado",
        "activo",
        "devuelto",
        "vencido",
        "rechazado",
        "reserva_aprobada",
        "reserva_parcialmente_aprobada"
      ])

      const fullData = await Promise.all(
        list
          .filter(p =>
            ESTADOS_VALIDOS.has((p.estado_prestamo || "").toLowerCase())
          )
          .map(async (p) => {

            const detalle = await fetchLoanDetails(p.id_prestamo, token)

            const materialesMap = {}

            ;(detalle?.detalles || []).forEach((d) => {
              const key = `${d.titulo}-${d.autor}`

              if (!materialesMap[key]) {
                materialesMap[key] = {
                  titulo: d.titulo,
                  autor: d.autor,
                  ejemplares: []
                }
              }

              materialesMap[key].ejemplares.push(d.id_ejemplar)
            })

          return {
            id: p.id_prestamo,
            usuario: p.nombre_apellido || "Usuario",
            estado: p.estado_prestamo || "",

            fechaPrestamo: p.fecha_solicitud?.split("T")[0] || "",

            fechaEntrega: p.fecha_tope_devolucion?.split("T")[0] || "",

            fechaRespuesta: p.fecha_respuesta?.split("T")[0] || "",
            fechaActivacion: p.fecha_activacion?.split("T")[0] || "",
            fechaDevolucion: p.fecha_devolucion?.split("T")[0] || "",

            totalEjemplares: p.total_ejemplares ?? 0,
            materiales: Object.values(materialesMap)
          }
          })
      )

      setPrestamos(fullData)
    } finally {
      setLoading(false)
      setLoadedPrestamos(true)
    }
  }

  // =========================
  // SOLICITUDES
  // =========================
  const fetchSolicitudes = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")

      const res = await fetch(`${API_URL}/loans?limit=200`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      const list = Array.isArray(data?.data) ? data.data : []

      const SOLO_SOLICITUDES = new Set([
        "solicitado",
        "solicitud_reserva",
        "solicitud_renovacion"
      ])

      const filtradas = list.filter((p) =>
        SOLO_SOLICITUDES.has(p.estado_prestamo)
      )

      const fullData = await Promise.all(
        filtradas.map(async (p) => {
          const detalle = await fetchLoanDetails(p.id_prestamo, token)

          const materialesMap = {}

          /*;(detalle?.detalles || []).forEach((d) => {
            const key = `${d.titulo}-${d.autor}`

            if (!materialesMap[key]) {
              materialesMap[key] = {
                id: detalle.materiales.id,
                titulo: d.titulo,
                autor: d.autor,
                ejemplares: []
              }
            }
           ;(detalle?.materiales || []).forEach((m) => {
              const key = `${m.id}`

              if (!materialesMap[key]) {
                materialesMap[key] = {
                  titulo: m.titulo,
                  autor: m.autor,
                  ejemplares: m.ejemplares
                }
              }

              materialesMap[key].ejemplares.push(m.id_ejemplar)
            })*/

          let tipoSolicitud = "Préstamo"
          if (p.estado_prestamo === "solicitud_reserva") tipoSolicitud = "Reserva"
          if (p.estado_prestamo === "solicitud_renovacion") tipoSolicitud = "Renovación"

          return {
            id: p.id_prestamo,
            usuario: p.nombre_apellido || "Usuario",
            tipoSolicitud,
            fecha: p.fecha_solicitud?.split("T")[0] || "",
            fechaLimite: p.fecha_tope_devolucion?.split("T")[0] || "",
            totalEjemplares: p.total_ejemplares ?? 0,
            materiales: detalle?.materiales
          }
        })
      )

      setSolicitudes(fullData)
    } finally {
      setLoading(false)
      setLoadedSolicitudes(true)
    }
  }

  useEffect(() => {
    if (activeTab === "prestamos") fetchPrestamos()
    if (activeTab === "solicitudes") fetchSolicitudes()
  }, [activeTab])

  // =========================
  // LOADING FIX
  // =========================
  const isLoading =
    loading ||
    (activeTab === "prestamos" && !loadedPrestamos) ||
    (activeTab === "solicitudes" && !loadedSolicitudes)

  const solicitudesFiltradas = solicitudes.filter((s) => {
    if (solicitudFiltro === "TODAS") return true
    return normalize(s.tipoSolicitud) === normalize(solicitudFiltro)
  })

  const prestamosFiltrados = prestamos.filter((p) => {
    if (estadoFiltro === "Todos los estados") return true
    return normalize(p.estado) === normalize(estadoFiltro)
  })

  const ITEMS_PER_PAGE = 6

  const prestamosToShow = prestamosFiltrados.slice(
    (prestamosPage - 1) * ITEMS_PER_PAGE,
    prestamosPage * ITEMS_PER_PAGE
  )

  const totalPrestamosPages = Math.ceil(
    prestamosFiltrados.length / ITEMS_PER_PAGE
  )

  return (
    <main className="prestamos-admin">

      <section className="prestamos-admin__header">
        <h1>Gestión de Préstamos</h1>
        <PrestamoTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </section>

      <section className="prestamos-admin__body">

        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Cargando datos...</p>
          </div>
        )}

        {!isLoading && activeTab === "solicitudes" && (
          <>
            <SolicitudFilters
              filtro={solicitudFiltro}
              setFiltro={setSolicitudFiltro}
              setPage={setSolicitudesPage}
            />

            {solicitudesFiltradas.length === 0 ? (
              <p style={{ color: "#fff", padding: "20px" }}>
                No hay solicitudes pendientes en este momento.
              </p>
            ) : (
              <div className="prestamos-admin__grid">
                {solicitudesFiltradas.map((solicitud) => (
                  <PrestamoSolicitudCard
                    key={solicitud.id}
                    solicitud={solicitud}
                    onAceptar={(s) =>
                      setModal({ open: true, action: "aceptar", solicitud: s })
                    }
                  />
                ))}
              </div>
            )}
          </>
        )}

        {!isLoading && activeTab === "prestamos" && (
          <>
            <PrestamoFilters
              estadoFiltro={estadoFiltro}
              setEstadoFiltro={(value) => {
                setEstadoFiltro(value)
                setPrestamosPage(1)
              }}
            />

          <div className="prestamos-admin__grid">
  {prestamosToShow.length === 0 ? (
    <p style={{ color: "#fff", padding: "20px" }}>
      {getEmptyMessage()}
    </p>
  ) : (
    prestamosToShow.map((prestamo) => (
      <PrestamoCard
        key={prestamo.id}
        prestamo={prestamo}
        onUpdated={() => {
          fetchPrestamos()
        }}
      />
    ))
  )}
</div>

            {totalPrestamosPages > 1 && (
              <PrestamoPagination
                currentPage={prestamosPage}
                totalPages={totalPrestamosPages}
                onPageChange={(page) => {
                  setPrestamosPage(page)
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
              />
            )}
          </>
        )}

      </section>

      <PrestamoConfirmModal
        open={modal.open}
        action={modal.action}
        solicitud={modal.solicitud}
        onClose={() =>
          setModal({ open: false, action: "", solicitud: null })
        }
        onSuccess={() => {
          fetchSolicitudes()
          fetchPrestamos()
        }}
      />

    </main>
  )
}

export default PrestamosAdmin