import api from './api'


// Historial completo de sesiones (Admin)
export const getSesiones = async (params = {}) => {

  const { data } = await api.get('/sessions', {
    params
  })

  return data

}


// Sesiones activas del usuario actual
export const getMisSesionesActivas = async () => {

  const { data } = await api.get('/sessions/active')

  return data.data

}