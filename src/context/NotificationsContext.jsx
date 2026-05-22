import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { getNotificaciones, marcarLeida, marcarTodasLeidas } from '../services/notifications.services'

const NotificationsContext = createContext(null)

export const NotificationsProvider = ({ children }) => {
  const { user } = useAuth()
  const [notificaciones, setNotificaciones] = useState([])
  const [noLeidas, setNoLeidas] = useState(0)

  const fetchNotificaciones = async () => {
    if (!user) return
    try {
      const data = await getNotificaciones()
      setNotificaciones(data.data)
      setNoLeidas(data.no_leidas)
    } catch {
      // silencioso
    }
  }

  useEffect(() => {
    fetchNotificaciones()
    // Refrescar cada 5 minutos
    const interval = setInterval(fetchNotificaciones, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [user])

  const leerNotificacion = async (id) => {
    await marcarLeida(id)
    setNotificaciones(prev =>
      prev.map(n => n.id_notificacion === id ? { ...n, leida: true } : n)
    )
    setNoLeidas(prev => Math.max(0, prev - 1))
  }

  const leerTodas = async () => {
    await marcarTodasLeidas()
    setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })))
    setNoLeidas(0)
  }

  return (
    <NotificationsContext.Provider value={{ notificaciones, noLeidas, fetchNotificaciones, leerNotificacion, leerTodas }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationsContext)
  if (!context) throw new Error('useNotifications debe usarse dentro de NotificationsProvider')
  return context
}