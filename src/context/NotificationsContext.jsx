import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { getNotificaciones, marcarLeida, marcarTodasLeidas } from '../services/notifications.services'

const NotificationsContext = createContext(null)

export const LIMITE_BADGE = 6

export const NotificationsProvider = ({ children }) => {
  const { user, rolActivo } = useAuth()
  const [notificaciones, setNotificaciones] = useState([])
  const [noLeidas, setNoLeidas] = useState(0)

  const fetchNotificaciones = async () => {
    if (!user) return
    try {
      const data = await getNotificaciones({ limit: LIMITE_BADGE })
      setNotificaciones(data.data)
      setNoLeidas(data.no_leidas)
    } catch {
      // silencioso, no rompemos la UI por esto
    }
  }

  useEffect(() => {
    fetchNotificaciones()
    const interval = setInterval(fetchNotificaciones, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [user, rolActivo])

  const leerNotificacion = async (id) => {
    await marcarLeida(id)
    await fetchNotificaciones()
  }

  const leerTodas = async () => {
    await marcarTodasLeidas()
    await fetchNotificaciones()
  }

  return (
    <NotificationsContext.Provider value={{
      notificaciones,
      noLeidas,
      limiteBadge: LIMITE_BADGE,
      fetchNotificaciones,
      leerNotificacion,
      leerTodas
    }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationsContext)
  if (!context) throw new Error('useNotifications debe usarse dentro de NotificationsProvider')
  return context
}