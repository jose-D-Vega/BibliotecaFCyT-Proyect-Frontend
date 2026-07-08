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

export const getDevolucionesUsuario = async ({ search, fecha_desde, fecha_hasta, page, limit }) => {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (fecha_desde) params.append('fecha_desde', fecha_desde)
  if (fecha_hasta) params.append('fecha_hasta', fecha_hasta)
  if (page) params.append('page', page)
  if (limit) params.append('limit', limit)
  const { data } = await api.get(`/returns/mis-devoluciones?${params.toString()}`)
  return data
}

// sanctions.services.js o returns.services.js, donde corresponda
export const resolveReservaAfectada = async (id_prestamo, id_ejemplar_anterior, payload) => {
  const { data } = await api.patch(
    `/returns/prestamo/${id_prestamo}/reserva-afectada/${id_ejemplar_anterior}`,
    payload // { accion: 'reasignar', id_ejemplar_nuevo } o { accion: 'descartar' }
  )
  return data
}

export const recuperarEjemplarPerdido = async (id_prestamo, id_ejemplar, payload) => {
  const { data } = await api.post(`/returns/prestamo/${id_prestamo}/ejemplar/${id_ejemplar}/recuperar`, payload)
  return data
}

export const reemplazarEjemplarPerdido = async (id_prestamo, id_ejemplar) => {
  const { data } = await api.post(`/returns/prestamo/${id_prestamo}/ejemplar/${id_ejemplar}/reemplazar`)
  return data
}