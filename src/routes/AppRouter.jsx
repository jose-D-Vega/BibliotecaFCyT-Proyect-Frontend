import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

import CatalogoPage from '../pages/public/CatalogoPublic'
import LibroDetallePublic from '../pages/public/LibroDetallePublic'

import LoginPage from '../pages/auth/LoginPage'
import AuthCallbackPage from '../pages/auth/AuthCallbackPage'
import RolSelectorPage from '../pages/auth/RolSelectorPage'
import CompletarPerfilPage from '../pages/auth/CompletarPerfilPage'

import DashboardPage from '../pages/user/DashboardUser'
import AdminDashboardPage from '../pages/admin/DashboardAdmin'

const AppRouter = () => {
  const { user, loading, rolActivo } = useAuth()

  if (loading) return <div>Cargando...</div>

  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/catalogo" element={<CatalogoPage></CatalogoPage>}/>
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
        
        {/* Completar datos de la cuenta del usuario */}
         <Route
          path="/completar-perfil"
          element={
            !user
              ? <Navigate to="/login" replace />
              : user.ci !== 'pendiente' && user.telefono
                ? <Navigate to={rolActivo === 'bibliotecario' ? '/admin' : '/dashboard'} replace />
                : <CompletarPerfilPage />
          }
        />

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