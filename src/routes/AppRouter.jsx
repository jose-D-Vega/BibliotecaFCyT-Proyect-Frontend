import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

// Páginas públicas
import CatalogoPage from '../pages/public/CatalogoPage'
import LoginPage from '../pages/public/LoginPage'
import AuthCallbackPage from '../pages/public/AuthCallbackPage'

// Páginas usuario normal
import DashboardPage from '../pages/user/DashboardPage'

// Páginas admin/bibliotecario
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'

const AppRouter = () => {
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<CatalogoPage />} />
        <Route path="/catalogo" element={<CatalogoPage />} />
        <Route
          path="/login"
          element={user ? <Navigate to={user.rol === 'bibliotecario' ? '/admin' : '/dashboard'} replace /> : <LoginPage />}
        />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Usuario normal */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter