import api from './api'

export const createLoan = async (items) => {
  const { data } = await api.post('/loans', { items })
  return data
}

export const getLoans = async (params = {}) => {
  const { data } = await api.get('/loans', { params })
  return data
}

export const getLoanById = async (id) => {
  const { data } = await api.get(`/loans/${id}`)
  return data.data
}

export const cancelLoan = async (id) => {
  const { data } = await api.patch(`/loans/${id}/cancel`)
  return data
}

// Cancelación "inteligente": decide server-side qué revertir según el estado actual
// del préstamo (usada por el admin en vez de cancelLoan a secas)
export const cancelLoanSmart = async (id) => {
  const { data } = await api.patch(`/loans/${id}/cancel-smart`)
  return data
}

export const renewLoan = async (id) => {
  const { data } = await api.patch(`/loans/${id}/renew`)
  return data
}

export const approveRenewal = async (id) => {
  const { data } = await api.patch(`/loans/${id}/renew/approve`)
  return data
}

export const rejectRenewal = async (id) => {
  const { data } = await api.patch(`/loans/${id}/renew/reject`)
  return data
}

// Cancela una solicitud de renovación propia antes de que sea respondida
export const cancelRenewal = async (id) => {
  const { data } = await api.patch(`/loans/${id}/renew/cancel`)
  return data
}

export const respondDetalle = async (id_prestamo, id_ejemplar, estado, observaciones) => {
  const { data } = await api.patch(`/loans/${id_prestamo}/detalle/${id_ejemplar}`, { estado, observaciones })
  return data
}

// Versión en lote: envía todas las respuestas de una solicitud en una sola
// petición (una sola transacción en el backend), en vez de una petición por
// ejemplar. Evita saturar el pool de conexiones cuando la solicitud tiene
// varios ejemplares.
export const respondDetalleBatch = async (id_prestamo, respuestas) => {
  const { data } = await api.patch(`/loans/${id_prestamo}/detalle-batch`, { respuestas })
  return data
}

export const activateLoan = async (id) => {
  const { data } = await api.patch(`/loans/${id}/activate`)
  return data
}