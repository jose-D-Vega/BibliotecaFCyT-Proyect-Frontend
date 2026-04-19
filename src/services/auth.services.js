import api from './api'

// Verificar token y obtener datos del usuario
export const getMe = async () => {
  const { data } = await api.get('/auth/me')
  return data.data
}

// La URL de login con Google — redirige directo al backend
export const getGoogleLoginUrl = () => {
  return `${import.meta.env.VITE_API_URL || 'http://localhost:3210/api'}/auth/google`
}