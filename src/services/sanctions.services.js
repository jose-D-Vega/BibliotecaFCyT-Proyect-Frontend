import api from './api'

export const getSanctions = async ({ id_usuario, estado, tipo_infraccion, page, limit }) => {
  const params = new URLSearchParams()
  if (id_usuario) params.append('id_usuario', id_usuario)
  if (estado) params.append('estado', estado)
  if (tipo_infraccion) params.append('tipo_infraccion', tipo_infraccion)
  if (page) params.append('page', page)
  if (limit) params.append('limit', limit)
  const { data } = await api.get(`/sanctions?${params.toString()}`)
  return data
}

export const getSanction = async (id) => {
  const { data } = await api.get(`/sanctions/${id}`)
  return data.data
}

export const createSanction = async (sancionData) => {
  const { data } = await api.post('/sanctions', sancionData)
  return data
}

export const resolveSanction = async (id) => {
  const { data } = await api.patch(`/sanctions/${id}/resolver`)
  return data
}

export const escalateSanction = async (id) => {
  const { data } = await api.patch(`/sanctions/${id}/escalar`)
  return data
}

export const getMySanctions = async () => {
  const { data } = await api.get('/sanctions/mis-sanciones')
  return data.data
}

export const confirmSanction = async (id) => {
  const { data } = await api.patch(`/sanctions/${id}/confirmar`)
  return data
}

export const rejectSanction = async (id) => {
  const { data } = await api.patch(`/sanctions/${id}/rechazar`)
  return data
}