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

export const renewLoan = async (id) => {
  const { data } = await api.patch(`/loans/${id}/renew`)
  return data
}

export const respondDetalle = async (id_prestamo, id_ejemplar, estado) => {
  const { data } = await api.patch(`/loans/${id_prestamo}/detalle/${id_ejemplar}`, { estado })
  return data
}

export const activateLoan = async (id) => {
  const { data } = await api.patch(`/loans/${id}/activate`)
  return data
}