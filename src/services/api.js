import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3210/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  const rolActivo = localStorage.getItem('rolActivo')
  if (token) config.headers.Authorization = `Bearer ${token}`
  if (rolActivo) config.headers['X-Rol-Activo'] = rolActivo
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const code = error.response?.data?.code

    if (status === 401) {
      // Token inválido o expirado — cerrar sesión siempre
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('rolActivo')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (status === 403 && code !== 'USUARIO_SANCIONADO') {
      // 403 sin code conocido = acceso prohibido por rol (posible token manipulado)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('rolActivo')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    // Cualquier otro error (403 USUARIO_SANCIONADO, 400, 404, 500...) 
    // se propaga normalmente para que cada componente lo maneje
    return Promise.reject(error)
  }
)

export default api