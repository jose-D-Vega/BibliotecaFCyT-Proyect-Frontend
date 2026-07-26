import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../../context/NotificationsContext'
import { useAuth } from '../../context/AuthContext'
import './styles/NotificacionesBadge.css'
import { getIconoTipo } from '../../utils/notificacionTipos'

const PREFIJO_POR_ROL = {
  admin: '/admin',
  bibliotecario: '/bibliotecario',
  normal: '/app'
}

const NotificacionesBadge = () => {
  const {
    notificaciones,
    noLeidas,
    limiteBadge,
    leerNotificacion,
    leerTodas,
    marcandoTodas = false,
    idsMarcando = new Set()
  } = useNotifications()
  const { rolActivo } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const irATodas = () => {
    setOpen(false)
    navigate(`${PREFIJO_POR_ROL[rolActivo] || '/app'}/notificaciones`)
  }

  const masNoLeidas = noLeidas > limiteBadge ? noLeidas - limiteBadge : 0

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
              <button
                className="notif-panel__marcar-todas"
                onClick={leerTodas}
                disabled={marcandoTodas}
              >
                {marcandoTodas ? (
                  <>
                    <span className="notif-spinner" />
                    Marcando...
                  </>
                ) : (
                  'Marcar todas como leídas'
                )}
              </button>
            )}
          </div>

          <div className="notif-panel__lista">
            {notificaciones.length === 0 ? (
              <p className="notif-panel__vacio">No tenés notificaciones</p>
            ) : (
              notificaciones.map(n => {
                const marcandoEsta = idsMarcando.has(n.id_notificacion)
                return (
                  <div
                    key={n.id_notificacion}
                    className={`notif-item ${!n.leida ? 'notif-item--no-leida' : ''} ${marcandoEsta ? 'notif-item--marcando' : ''}`}
                    onClick={() => !n.leida && !marcandoEsta && leerNotificacion(n.id_notificacion)}
                  >
                    <span className="notif-item__icono">{getIconoTipo(n.tipo)}</span>
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
                    {marcandoEsta ? (
                      <span className="notif-spinner notif-spinner--dot" />
                    ) : (
                      !n.leida && <span className="notif-item__dot" />
                    )}
                  </div>
                )
              })
            )}
          </div>

          {masNoLeidas > 0 && (
            <p className="notif-panel__mas-no-leidas">
              +{masNoLeidas} sin leer
            </p>
          )}

          <div className="notif-panel__footer">
            <button className="notif-panel__ver-todas" onClick={irATodas}>
              Ver todas las notificaciones
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificacionesBadge