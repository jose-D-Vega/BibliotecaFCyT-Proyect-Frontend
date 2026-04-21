import api from './api'

export const updateProfile = async ({ ci, telefono }) => {
  const { data } = await api.put('/users/me', { ci, telefono })
  return data
}

export const updateTelefono = async (telefono) => {
  const { data } = await api.put('/users/me', { telefono })
  return data
}

export const getProfile = async () => {
  const { data } = await api.get('/users/me')
  return data.data
}