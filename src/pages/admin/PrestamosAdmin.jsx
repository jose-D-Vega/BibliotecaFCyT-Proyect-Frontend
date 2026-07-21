import { useEffect, useState } from "react"

import { useLocation, useNavigate } from "react-router-dom"
import { MdArrowBack } from "react-icons/md"


import "./styles/PrestamosAdmin.css"


import PrestamoTabs from "../../components/prestamos-admin/PrestamoTabs"
import PrestamoSolicitudCard from "../../components/prestamos-admin/PrestamoSolicitudCard"
import PrestamoCardAdmin from "../../components/prestamos-admin/PrestamoCardAdmin"
import PrestamoFilters from "../../components/prestamos-admin/PrestamoFilters"
import PrestamoConfirmModal from "../../components/prestamos-admin/PrestamoConfirmModal"
import PrestamoPagination from "../../components/prestamos-admin/PrestamoPagination"
import SolicitudFilters from "../../components/prestamos-admin/SolicitudFilters"
import { getLoans } from "../../services/loans.services"

const ITEMS_PER_PAGE = 6

function PrestamosAdmin() {
    const location = useLocation()
  const navigate = useNavigate()
  const rolActivo = localStorage.getItem("rolActivo")

  const [activeTab, setActiveTab] = useState(location.state?.tab || "solicitudes")

  const [solicitudes, setSolicitudes] = useState([])
  const [prestamos, setPrestamos] = useState([])

  const [solicitudesPaginacion, setSolicitudesPaginacion] = useState({ total: 0, page: 1, totalPages: 1 })
  const [prestamosPaginacion, setPrestamosPaginacion] = useState({ total: 0, page: 1, totalPages: 1 })

  const [loading, setLoading] = useState(false)

  // Control real de carga: evita el flash de "no hay resultados" antes de que
  // termine el primer fetch de cada pestaña

  const [loadedSolicitudes, setLoadedSolicitudes] = useState(false)
  const [loadedPrestamos, setLoadedPrestamos] = useState(false)

  const [solicitudFiltro, setSolicitudFiltro] = useState(location.state?.solicitudFiltro || "TODAS")
  const [estadoFiltro, setEstadoFiltro] = useState(location.state?.estadoFiltro || "Todos los estados")

  const [prestamosPage, setPrestamosPage] = useState(1)
  const [solicitudesPage, setSolicitudesPage] = useState(1)

  const [modal, setModal] = useState({
    open: false,
    action: "",
    solicitud: null
  })

  // Si llega un nuevo state de navegación (ej. desde otra tarjeta del dashboard), aplicarlo
  useEffect(() => {
    if (location.state?.tab) setActiveTab(location.state.tab)
    if (location.state?.estadoFiltro) setEstadoFiltro(location.state.estadoFiltro)
    if (location.state?.solicitudFiltro) setSolicitudFiltro(location.state.solicitudFiltro)
  }, [location.state])

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

  // =========================
  // Helpers de mapeo (compartidos entre pestañas)
  // =========================

  // Agrupa `detalles` (ya incluido en la respuesta de /api/loans) por libro,
  // igual que hace el backend en getLoanMaterials — pero sin pedir nada extra al servidor.
  const agruparMaterialesPorLibro = (detalles = []) => {
    const materialesMap = {}

    detalles.forEach((d) => {
      const key = d.id_libro ?? `${d.titulo}-${d.autor}`

      if (!materialesMap[key]) {
        materialesMap[key] = {
          id: d.id_libro,
          titulo: d.titulo,
          autor: d.autor,
          ejemplares: []
        }
      }

      materialesMap[key].ejemplares.push(d.id_ejemplar)
    })

    return Object.values(materialesMap)
  }

  // A diferencia de agruparMaterialesPorLibro (que muestra todo, para el tab
  // "Préstamos"), esta versión filtra solo lo que todavía está 'solicitado' —
  // para el modal de Solicitudes el bibliotecario NUNCA debería poder volver
  // a tocar un ítem que ya se aprobó o rechazó antes (eso ya es una decisión
  // firme, posiblemente con reasignaciones ya hechas sobre ella).
  const agruparMaterialesPendientes = (detalles = []) => {
    const materialesMap = {}

    detalles
      .filter(d => d.estado_prestamo_ejemplar !== 'rechazado')
      .forEach((d) => {
        const key = d.id_libro ?? `${d.titulo}-${d.autor}`

        if (!materialesMap[key]) {
          materialesMap[key] = {
            id: d.id_libro,
            titulo: d.titulo,
            autor: d.autor,
            ejemplares: []
          }
        }

        materialesMap[key].ejemplares.push(d.id_ejemplar)
      })

    return Object.values(materialesMap)
  }

  const mapPrestamo = (p) => ({
    id: p.id_prestamo,
    usuario: p.nombre_apellido || "Usuario",
    estado: p.estado_prestamo || "",

    fechaPrestamo: p.fecha_solicitud?.split("T")[0] || "",
    fechaEntrega: p.fecha_tope_devolucion?.split("T")[0] || "",

    fechaRespuesta: p.fecha_respuesta?.split("T")[0] || "",
    fechaActivacion: p.fecha_activacion?.split("T")[0] || "",
    fechaDevolucion: p.fecha_devolucion?.split("T")[0] || "",

    detalles: p.detalles || [],
    materiales: agruparMaterialesPorLibro(p.detalles)
  })

  const mapSolicitud = (p) => {
    const detallesReserva = (p.detalles || []).filter(d => d.es_reserva)
    const yaAprobados = detallesReserva.filter(d => d.estado_prestamo_ejemplar === "solicitado").length
    const yaRechazados = detallesReserva.filter(d => d.estado_prestamo_ejemplar === "rechazado").length
    const tieneSolicitadoPendiente = detallesReserva.some(d => d.estado_prestamo_ejemplar === "solicitado")

    let tipoSolicitud = "Préstamo"
    const esRondaFinalReserva =
      ["reserva_aprobada", "reserva_parcialmente_aprobada"].includes(p.estado_prestamo) &&
      !tieneSolicitadoPendiente
    const esReservaConDecisionPendiente =
      ["reserva_aprobada", "reserva_parcialmente_aprobada"].includes(p.estado_prestamo) &&
      tieneSolicitadoPendiente

    if (p.estado_prestamo === "solicitud_reserva" || esRondaFinalReserva || esReservaConDecisionPendiente) {
      tipoSolicitud = "Reserva"
    }
    if (p.estado_prestamo === "solicitud_renovacion") tipoSolicitud = "Renovación"

    return {
      id: p.id_prestamo,
      usuario: p.nombre_apellido || "Usuario",
      tipoSolicitud,
      esRondaFinalReserva,
      esReservaConDecisionPendiente,
      yaAprobados,
      yaRechazados,
      fecha: p.fecha_solicitud?.split("T")[0] || "",
      fechaLimite: p.fecha_tope_devolucion?.split("T")[0] || "",
      totalEjemplares: p.total_ejemplares ?? 0,
      materiales: agruparMaterialesPendientes(p.detalles)  
    }
  }

  const mapEstadoFiltroABackend = (valor) =>
    valor === "Todos los estados" ? undefined : valor.toLowerCase()

  const mapTipoAEstadosSolicitud = (tipo) => {
    if (tipo === "PRESTAMO") return ["solicitado"]
    // RESERVA trae las dos rondas: la solicitud inicial Y las reservas ya
    // listas para gestionar la entrega final (antes quedaban "perdidas" acá,
    // sin ningún lugar del frontend donde el admin pudiera confirmarlas)
    if (tipo === "RESERVA") return ["solicitud_reserva", "reserva_aprobada", "reserva_parcialmente_aprobada"]
    if (tipo === "RENOVACION") return ["solicitud_renovacion"]
    return ["solicitado", "solicitud_reserva", "solicitud_renovacion", "reserva_aprobada", "reserva_parcialmente_aprobada"]
  }



  // =========================
  // PRESTAMOS — un solo request, filtro y paginación reales del backend
  // =========================
  const fetchPrestamos = async (page = prestamosPage, estado = estadoFiltro) => {

    setLoading(true)
    try {
      const resp = await getLoans({
        estado: mapEstadoFiltroABackend(estado),
        excluir_pendientes_solicitud: true, 
        page,
        limit: ITEMS_PER_PAGE
      })

      setPrestamos((resp.data || []).map(mapPrestamo))
      setPrestamosPaginacion(resp.pagination || { total: 0, page: 1, totalPages: 1 })
    } finally {
      setLoading(false)
      setLoadedPrestamos(true)
    }
  }


  // =========================
  // SOLICITUDES — mismo endpoint, filtrando por los 3 estados de "solicitud"
  // (o uno solo, según el tipo elegido) directamente en el backend
  // =========================
  const fetchSolicitudes = async (page = solicitudesPage, tipo = solicitudFiltro) => {

    setLoading(true)
    try {
      const resp = await getLoans({
        estados: mapTipoAEstadosSolicitud(tipo).join(","),
        solo_reservas_listas: true,
        page,
        limit: ITEMS_PER_PAGE
      })


      
      setSolicitudes((resp.data || []).map(mapSolicitud))
      setSolicitudesPaginacion(resp.pagination || { total: 0, page: 1, totalPages: 1 })

    } finally {
      setLoading(false)
      setLoadedSolicitudes(true)
    }
  }

  useEffect(() => {
    if (activeTab === "prestamos") fetchPrestamos(prestamosPage, estadoFiltro)
    if (activeTab === "solicitudes") fetchSolicitudes(solicitudesPage, solicitudFiltro)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])


  // =========================
  // Handlers de filtro — ahora disparan un fetch nuevo (el filtro ya es del backend)
  // =========================
  const handleEstadoFiltroChange = (valor) => {
    setEstadoFiltro(valor)
    setPrestamosPage(1)
    fetchPrestamos(1, valor)
  }

  const handleSolicitudFiltroChange = (valor) => {
    setSolicitudFiltro(valor)
    setSolicitudesPage(1)
    fetchSolicitudes(1, valor)
  }


  const isLoading =
    loading ||
    (activeTab === "prestamos" && !loadedPrestamos) ||
    (activeTab === "solicitudes" && !loadedSolicitudes)

  return (
    <main className="prestamos-admin">

      <section className="prestamos-admin__header">

  {location.state?.fromDashboard && (
    <button
      className="prestamos-admin__volver-btn"
      onClick={() =>
        navigate(
          rolActivo === "bibliotecario"
            ? "/bibliotecario/inicio"
            : "/admin/inicio"
        )
      }
    >
      <MdArrowBack size={16} />
      Volver al inicio
    </button>
  )}

  <h1>Gestión de Préstamos</h1>

  <PrestamoTabs
    activeTab={activeTab}
    setActiveTab={setActiveTab}
  />

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
              setFiltro={handleSolicitudFiltroChange}
              setPage={setSolicitudesPage}
            />

            {solicitudes.length === 0 ? (
              <p style={{ color: "#fff", padding: "20px" }}>
                No hay solicitudes pendientes en este momento.
              </p>
            ) : (
              <div className="prestamos-admin__grid">
                {solicitudes.map((solicitud) => (
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

            {solicitudesPaginacion.totalPages > 1 && (
              <PrestamoPagination
                currentPage={solicitudesPage}
                totalPages={solicitudesPaginacion.totalPages}
                onPageChange={(page) => {
                  setSolicitudesPage(page)
                  fetchSolicitudes(page, solicitudFiltro)
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
              />
            )}
          </>
        )}

        {!isLoading && activeTab === "prestamos" && (
          <>
            <PrestamoFilters
              estadoFiltro={estadoFiltro}
              setEstadoFiltro={handleEstadoFiltroChange}
            />

            <div className="prestamos-admin__grid">
              {prestamos.length === 0 ? (
                <p style={{ color: "#fff", padding: "20px" }}>
                  {getEmptyMessage()}
                </p>
              ) : (
                prestamos.map((prestamo) => (
                  <PrestamoCardAdmin
                    key={prestamo.id}
                    prestamo={prestamo}
                    onUpdated={() => fetchPrestamos()}
                  />
                ))
              )}
            </div>

            {prestamosPaginacion.totalPages > 1 && (
              <PrestamoPagination
                currentPage={prestamosPage}
                totalPages={prestamosPaginacion.totalPages}
                onPageChange={(page) => {
                  setPrestamosPage(page)
                  fetchPrestamos(page, estadoFiltro)
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

export default PrestamosAdmin;