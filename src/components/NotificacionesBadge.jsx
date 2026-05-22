import { useState, useRef, useEffect } from 'react'
import { useNotifications } from '../context/NotificationsContext'
import './styles/NotificacionesBadge.css'

const tipoIcono = {
  renovacion_aprobada: '✅',
  renovacion_rechazada: '❌',
  renovacion_vencida: '⏰',
  prestamo_por_vencer: '⚠️',
  prestamo_vencido: '🔴',
  pendiente_devolucion: '📚',
  reserva_disponible: '🔔'
}

const NotificacionesBadge = () => {
  const { notificaciones, noLeidas, leerNotificacion, leerTodas } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="notif-wrapper" ref={ref}>
      <button className="notif-btn" onClick={() => setOpen(o => !o)}>
        🔔
        {noLeidas > 0 && (
          <span className="notif-badge">{noLeidas > 9 ? '9+' : noLeidas}</span>
        )}
      </button>

      {open && (
        <div className="notif-panel">
          <div className="notif-panel__header">
            <span>Notificaciones</span>
            {noLeidas > 0 && (
              <button className="notif-panel__marcar-todas" onClick={leerTodas}>
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="notif-panel__lista">
            {notificaciones.length === 0 ? (
              <p className="notif-panel__vacio">No tenés notificaciones</p>
            ) : (
              notificaciones.map(n => (
                <div
                  key={n.id_notificacion}
                  className={`notif-item ${!n.leida ? 'notif-item--no-leida' : ''}`}
                  onClick={() => !n.leida && leerNotificacion(n.id_notificacion)}
                >
                  <span className="notif-item__icono">{tipoIcono[n.tipo] || '🔔'}</span>
                  <div className="notif-item__contenido">
                    <p className="notif-item__titulo">{n.titulo}</p>
                    <p className="notif-item__mensaje">{n.mensaje}</p>
                    <p className="notif-item__fecha">
                      {new Date(n.fecha).toLocaleDateString('es-PY', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {!n.leida && <span className="notif-item__dot" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificacionesBadge