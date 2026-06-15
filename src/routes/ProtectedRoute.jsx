import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, rolActivo, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div>Cargando...</div>
  if (!user) return <Navigate to="/login" replace />

  // Usuarios con rol de gestión sin rol elegido → select-rol
  const esGestion = ['bibliotecario', 'admin'].includes(user.rol)
  if (esGestion && !rolActivo && location.pathname !== '/select-rol') {
    return <Navigate to="/select-rol" replace />
  }

  // Si se requiere un rol específico y el activo no coincide
  if (requiredRole && rolActivo !== requiredRole) {
  if (rolActivo === 'admin') return <Navigate to="/admin/inicio" replace />
    if (rolActivo === 'bibliotecario') return <Navigate to="/bibliotecario/inicio" replace />
    return <Navigate to="/app/inicio" replace />
  }


  return children
}

export default ProtectedRoute