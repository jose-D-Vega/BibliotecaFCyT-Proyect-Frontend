import api from './api'

export const getNotificaciones = async () => {
  const { data } = await api.get('/notifications')
  return data
}

export const marcarLeida = async (id) => {
  const { data } = await api.patch(`/notifications/${id}/leida`)
  return data
}

export const marcarTodasLeidas = async () => {
  const { data } = await api.patch('/notifications/leidas')
  return data
}