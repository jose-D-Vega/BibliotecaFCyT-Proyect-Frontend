import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

import CatalogoPage from '../pages/public/CatalogoPage'
import LoginPage from '../pages/auth/LoginPage'
import AuthCallbackPage from '../pages/auth/AuthCallbackPage'
import RolSelectorPage from '../pages/auth/RolSelectorPage'
import DashboardPage from '../pages/user/DashboardPage'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'

const AppRouter = () => {
  const { user, loading } = useAuth()

  if (loading) return <div>Cargando...</div>

  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/catalogo" element={<CatalogoPage />} />

        {/* Login — si ya está autenticado redirigir */}
        <Route
          path="/login"
          element={
            user
              ? <Navigate to={user.rol === 'bibliotecario' ? '/select-rol' : '/dashboard'} replace />
              : <LoginPage />
          }
        />

        {/* Callback de Google */}
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Selección de rol — solo bibliotecarios autenticados */}
        <Route
          path="/select-rol"
          element={
            !user
              ? <Navigate to="/login" replace />
              : user.rol !== 'bibliotecario'
                ? <Navigate to="/dashboard" replace />
                : <RolSelectorPage />
          }
        />

        {/* Usuario normal */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="normal">
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Bibliotecario */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="bibliotecario">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="bibliotecario">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter