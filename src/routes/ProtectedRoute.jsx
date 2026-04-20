import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, rolActivo, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div>Cargando...</div>

  if (!user) return <Navigate to="/login" replace />

  // Bibliotecario sin rol elegido → select-rol
  // Excepto si ya está en /select-rol para evitar loop
  if (user.rol === 'bibliotecario' && !rolActivo && location.pathname !== '/select-rol') {
    return <Navigate to="/select-rol" replace />
  }

  // Si se requiere un rol específico y el activo no coincide
  if (requiredRole && rolActivo !== requiredRole) {
    if (rolActivo === 'bibliotecario') return <Navigate to="/admin" replace />
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute