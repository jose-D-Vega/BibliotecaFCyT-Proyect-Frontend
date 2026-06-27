import api from './api'

export const getNotificaciones = async ({ tipo, leida, fecha_desde, fecha_hasta, page, limit } = {}) => {
  const params = new URLSearchParams()
  if (tipo) params.append('tipo', tipo)
  if (leida !== undefined && leida !== null && leida !== '') params.append('leida', leida)
  if (fecha_desde) params.append('fecha_desde', fecha_desde)
  if (fecha_hasta) params.append('fecha_hasta', fecha_hasta)
  if (page) params.append('page', page)
  if (limit) params.append('limit', limit)
  const { data } = await api.get(`/notifications?${params.toString()}`)
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