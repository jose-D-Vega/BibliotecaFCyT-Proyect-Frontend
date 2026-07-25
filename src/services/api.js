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

    if (status === 401) {
      // Token inválido o expirado — cerrar sesión siempre
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('rolActivo')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    // 403 (y cualquier otro error: 400, 404, 500...) se propaga normalmente:
    // un 403 significa "no tenés permiso para ESTA acción puntual", no que
    // la sesión esté comprometida. Que cada componente lo maneje y muestre
    // su propio mensaje.
    return Promise.reject(error)
  }
)

export default api