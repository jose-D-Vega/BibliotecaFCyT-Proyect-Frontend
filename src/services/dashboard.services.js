import api from './api'

// Usuario normal — sus propias estadísticas
export const getMisEstadisticas = async () => {
  const { data } = await api.get('/dashboard/mis-estadisticas')
  return data.data
}

// Bibliotecario y admin — estadísticas globales del sistema
// (el backend agrega paneles extra automáticamente si el rol activo es admin)
export const getStaffEstadisticas = async () => {
  const { data } = await api.get('/dashboard/staff-estadisticas')
  return data.data
}