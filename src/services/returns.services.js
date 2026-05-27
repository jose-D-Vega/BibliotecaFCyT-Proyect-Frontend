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