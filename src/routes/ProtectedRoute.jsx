import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth()

  if (loading) return <div>Cargando...</div>

  if (!user) return <Navigate to="/login" replace />

  if (requiredRole && user.rol !== requiredRole) {
    // Si es bibliotecario intentando entrar a ruta de usuario, redirigir a su panel
    if (user.rol === 'bibliotecario') return <Navigate to="/admin" replace />
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute