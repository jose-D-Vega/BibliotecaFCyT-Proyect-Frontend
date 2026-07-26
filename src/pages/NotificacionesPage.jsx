import { useState, useEffect, useCallback } from 'react'
import { getNotificaciones, marcarLeida, marcarTodasLeidas } from '../services/notifications.services'
import { useNotifications } from '../context/NotificationsContext'
import NotificacionesFilters from '../components/notificaciones/NotificacionesFilters'
import PrestamoPagination from '../components/prestamos-admin/PrestamoPagination'
import './styles/NotificacionesPage.css'
import { useAuth } from '../context/AuthContext'
import { getIconoTipo, getTiposPorRol } from '../utils/notificacionTipos'

const LIMITE_PAGINA = 15

const NotificacionesPage = () => {
  const { fetchNotificaciones: refrescarBadge } = useNotifications()
  const { rolActivo } = useAuth()
  const tiposDisponibles = getTiposPorRol(rolActivo)

  const [notificaciones, setNotificaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalNotificaciones, setTotalNotificaciones] = useState(0)

  const [tipoFiltro, setTipoFiltro] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  const [marcandoTodas, setMarcandoTodas] = useState(false)
  const [idsMarcando, setIdsMarcando] = useState(() => new Set())

  const limpiarFiltros = () => {
    setTipoFiltro('')
    setEstadoFiltro('')
    setFechaDesde('')
    setFechaHasta('')
  }

const hayFiltrosActivos = tipoFiltro || estadoFiltro || fechaDesde || fechaHasta

  const fetchPagina = useCallback(async (pag) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getNotificaciones({
        tipo: tipoFiltro,
        leida: estadoFiltro,
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
        page: pag,
        limit: LIMITE_PAGINA
      })
      setNotificaciones(data.data)
      setTotalPaginas(data.pagination.totalPages)
      setTotalNotificaciones(data.pagination.total)
    } catch {
      setError('No se pudieron cargar las notificaciones')
    } finally {
      setLoading(false)
    }
  }, [tipoFiltro, estadoFiltro, fechaDesde, fechaHasta])

  useEffect(() => {
    setPagina(1)
    fetchPagina(1)
  }, [tipoFiltro, estadoFiltro, fechaDesde, fechaHasta])

  useEffect(() => {
    fetchPagina(pagina)
  }, [pagina])

  const marcarUnaLeida = async (id) => {
    if (idsMarcando.has(id)) return // ya se está procesando, evita doble click

    setIdsMarcando(prev => new Set(prev).add(id))
    try {
      await marcarLeida(id)
      setNotificaciones(prev => prev.map(n => n.id_notificacion === id ? { ...n, leida: true } : n))
      refrescarBadge()
    } finally {
      setIdsMarcando(prev => {
        const siguiente = new Set(prev)
        siguiente.delete(id)
        return siguiente
      })
    }
  }

  const marcarTodas = async () => {
    if (marcandoTodas) return

    setMarcandoTodas(true)
    try {
      await marcarTodasLeidas()
      await fetchPagina(pagina)
      refrescarBadge()
    } finally {
      setMarcandoTodas(false)
    }
  }

  const hayNoLeidas = notificaciones.some(n => !n.leida)

  return (
    <div className="notif-page">
      <div className="notif-page__header">
        <h1 className="notif-page__title">Notificaciones</h1>
        {hayNoLeidas && (
          <button
            className="notif-page__marcar-todas-btn"
            onClick={marcarTodas}
            disabled={marcandoTodas}
          >
            {marcandoTodas ? (
              <>
                <span className="notif-page__spinner-inline" />
                Marcando...
              </>
            ) : (
              'Marcar todas como leídas'
            )}
          </button>
        )}
      </div>

      <NotificacionesFilters
        tipos={tiposDisponibles}
        tipoFiltro={tipoFiltro} setTipoFiltro={setTipoFiltro}
        estadoFiltro={estadoFiltro} setEstadoFiltro={setEstadoFiltro}
        fechaDesde={fechaDesde} setFechaDesde={setFechaDesde}
        fechaHasta={fechaHasta} setFechaHasta={setFechaHasta}
      />

      {hayFiltrosActivos && (
        <button className="notif-page__limpiar-btn" onClick={limpiarFiltros}>
          Limpiar filtros
        </button>
      )}

      {loading ? (
        <div className="notif-page__loader">
          <div className="notif-page__spinner"></div>
          <p>Cargando notificaciones...</p>
        </div>
      ) : error ? (
        <p className="notif-page__estado notif-page__estado--error">{error}</p>
      ) : notificaciones.length === 0 ? (
        <p className="notif-page__estado">No hay notificaciones con estos filtros</p>
      ) : (
        <>
          <p className="notif-page__total">
            {totalNotificaciones} notificación{totalNotificaciones !== 1 ? 'es' : ''} en total
          </p>

          <div className="notif-page__lista">
            {notificaciones.map(n => {
              const marcandoEsta = idsMarcando.has(n.id_notificacion)
              return (
                <div
                  key={n.id_notificacion}
                  className={`notif-page__item ${!n.leida ? 'notif-page__item--no-leida' : ''} ${marcandoEsta ? 'notif-page__item--marcando' : ''}`}
                  onClick={() => !n.leida && !marcandoEsta && marcarUnaLeida(n.id_notificacion)}
                >
                  <span className="notif-page__icono">{getIconoTipo(n.tipo)}</span>
                  <div className="notif-page__contenido">
                    <p className="notif-page__titulo">{n.titulo}</p>
                    <p className="notif-page__mensaje">{n.mensaje}</p>
                    <p className="notif-page__fecha">
                      {new Date(n.fecha).toLocaleDateString('es-PY', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {marcandoEsta ? (
                    <span className="notif-page__spinner-dot" />
                  ) : (
                    !n.leida && <span className="notif-page__dot" />
                  )}
                </div>
              )
            })}
          </div>

          <PrestamoPagination
            currentPage={pagina}
            totalPages={totalPaginas}
            onPageChange={setPagina}
          />
        </>
      )}
    </div>
  )
}

export default NotificacionesPage