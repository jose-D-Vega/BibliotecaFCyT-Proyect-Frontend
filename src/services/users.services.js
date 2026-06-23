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

// Buscar usuarios por nombre, correo o ci (admin) — para sanciones por comportamiento
export const searchUsers = async (search) => {
  const params = new URLSearchParams({ search, limit: 10 })
  const { data } = await api.get(`/users?${params.toString()}`)
  return data.data
}