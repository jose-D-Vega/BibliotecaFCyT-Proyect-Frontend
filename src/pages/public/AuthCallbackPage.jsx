import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMe } from '../../services/auth.services'

const AuthCallbackPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search)
      const token = params.get('token')
      const error = params.get('error')

      if (error === 'dominio_invalido') {
        navigate('/login?error=dominio_invalido', { replace: true })
        return
      }

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      try {
        // Guardar token y obtener datos del usuario
        localStorage.setItem('token', token)
        const userData = await getMe()
        login(token, userData)

        // Limpiar el token de la URL
        window.history.replaceState({}, '', '/auth/callback')

        // Redirigir según rol
        if (userData.rol === 'bibliotecario') {
          navigate('/admin', { replace: true })
        } else {
          navigate('/dashboard', { replace: true })
        }
      } catch {
        localStorage.removeItem('token')
        navigate('/login', { replace: true })
      }
    }

    handleCallback()
  }, [])

  return <div>Iniciando sesión...</div>
}

export default AuthCallbackPage