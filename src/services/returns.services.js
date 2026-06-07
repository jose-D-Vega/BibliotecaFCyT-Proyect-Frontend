import api from './api'

export const searchActiveLoans = async (search) => {
  const { data } = await api.get(`/returns/search?search=${encodeURIComponent(search)}`)
  return data.data
}

export const getLoanForReturn = async (id_prestamo) => {
  const { data } = await api.get(`/returns/${id_prestamo}`)
  return data.data
}

export const registerReturn = async (id_prestamo, devoluciones) => {
  const { data } = await api.post(`/returns/${id_prestamo}/devolver`, { devoluciones })
  return data
}

export const getHistorialDevoluciones = async ({ search, fecha_desde, fecha_hasta, page, limit }) => {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (fecha_desde) params.append('fecha_desde', fecha_desde)
  if (fecha_hasta) params.append('fecha_hasta', fecha_hasta)
  if (page) params.append('page', page)
  if (limit) params.append('limit', limit)
  const { data } = await api.get(`/returns/historial?${params.toString()}`)
  return data
}

export const getAllActiveLoans = async () => {
  const { data } = await api.get('/returns/activos')
  return data.data
}

export const getPrestamosConDevoluciones = async ({ search, fecha_desde, fecha_hasta, id_bibliotecario, page, limit }) => {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (fecha_desde) params.append('fecha_desde', fecha_desde)
  if (fecha_hasta) params.append('fecha_hasta', fecha_hasta)
  if (id_bibliotecario) params.append('id_bibliotecario', id_bibliotecario)
  if (page) params.append('page', page)
  if (limit) params.append('limit', limit)
  const { data } = await api.get(`/returns/historial-prestamos?${params.toString()}`)
  return data
}

export const getDetalleDevoluciones = async (id_prestamo) => {
  const { data } = await api.get(`/returns/${id_prestamo}/detalle-devoluciones`)
  return data.data
}