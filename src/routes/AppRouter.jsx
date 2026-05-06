import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'
import ScrollToTop from './ScrollToTop'


import UserLayout from '../layouts/UserLayout'
import AdminLayout from '../layouts/AdminLayout'

import CatalogoPage from '../pages/public/CatalogoPage'
import DetalleLibroPublicPage from '../pages/public/DetalleLibroPublicPage'
import NuevoMaterial from '../pages/admin/NuevoMaterial'

import LoginPage from '../pages/auth/LoginPage'
import AuthCallbackPage from '../pages/auth/AuthCallbackPage'
import RolSelectorPage from '../pages/auth/RolSelectorPage'
import CompletarPerfilPage from '../pages/auth/CompletarPerfilPage'

import DashboardPage from '../pages/user/DashboardUser'
import CatalogoUserPage from '../pages/user/prueba/CatalogoUserPage'
import DetalleLibroUserPage from '../pages/user/prueba/DetalleLibroUserPage'
import CarritoPage from '../pages/user/Carrito'
import PrestamosPage from '../pages/user/prueba/PrestamosPage'
import DevolucionesPage from '../pages/user/prueba/DevolucionesPage'
import SancionesPage from '../pages/user/prueba/SancionesPage'
import PerfilUserPage from '../pages/user/prueba/PerfilUserPage'

import AdminDashboardPage from '../pages/admin/DashboardAdmin'
import AdminPrestamosPage from '../pages/admin/prueba/AdminPrestamosPage'
import AdminDevolucionesPage from '../pages/admin/prueba/AdminDevolucionesPage'
import AdminCatalogoPage from '../pages/admin/prueba/AdminCatalogoPage'
import DetalleLibroAdminPage from '../pages/admin/prueba/DetalleLibroAdminPage'
import NuevoLibroPage from '../pages/admin/prueba/NuevoLibroPage'
import EditarLibroPage from '../pages/admin/prueba/EditarLibroPage'
import UsuariosPage from '../pages/admin/prueba/UsuariosPage'
import AdminSancionesPage from '../pages/admin/prueba/AdminSancionesPage'
import InformesPage from '../pages/admin/prueba/InformesPage'
import PerfilAdminPage from '../pages/admin/prueba/PerfilAdminPage'

const AppRouter = () => {
  const { user, loading, rolActivo } = useAuth()

  if (loading) return <div>Cargando...</div>

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>

        <Route path="/" element={<LoginPage />} />
        <Route path="/catalogo" element={<CatalogoPage />} />
        <Route path="/catalogo/:id" element={<DetalleLibroPublicPage />} />
        {/**
         * <Route path="/catalogo/:id" element={<DetalleLibroPublicoPage />} />
         */}
        

        {/* Login — si ya está autenticado redirigir */}

        <Route
          path="/login"
          element={
            user
              ? <Navigate to={user.rol === 'bibliotecario' ? '/select-rol' : '/app/inicio'} replace />
              : <LoginPage />
          }
        />

        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        <Route
          path="/completar-perfil"
          element={
            !user
              ? <Navigate to="/login" replace />
              : user.ci !== 'pendiente' && user.telefono
                ? <Navigate to={rolActivo === 'bibliotecario' ? '/admin/inicio' : '/app/inicio'} replace />
                : <CompletarPerfilPage />
          }
        />

        <Route
          path="/select-rol"
          element={
            !user
              ? <Navigate to="/login" replace />
              : user.rol !== 'bibliotecario'
                ? <Navigate to="/app/inicio" replace />
                : <RolSelectorPage />
          }
        />

        {/* USER */}
        <Route
          path="/app"
          element={
            <ProtectedRoute requiredRole="normal">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="inicio" replace />} />
          <Route path="inicio" element={<DashboardPage />} />
          <Route path="catalogo" element={<CatalogoUserPage />} />
          <Route path="catalogo/:id" element={<DetalleLibroUserPage />} />
          <Route path="carrito" element={<CarritoPage />} />
          
          <Route path="perfil" element={<PerfilUserPage />} />
          <Route path="prestamos" element={<PrestamosPage />} />
          <Route path="devoluciones" element={<DevolucionesPage />} />
          <Route path="sanciones" element={<SancionesPage />} />
        </Route>

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="bibliotecario">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="inicio" replace />} />
          <Route path="inicio" element={<AdminDashboardPage />} />
          <Route path="prestamos" element={<AdminPrestamosPage />} />
          <Route path="devoluciones" element={<AdminDevolucionesPage />} />

          <Route path="catalogo" element={<AdminCatalogoPage />} />
          <Route path="catalogo/:id/editar" element={<EditarLibroPage />} />
          <Route path="catalogo/:id" element={<DetalleLibroAdminPage />} />
          {/**
           *<Route path="catalogo/:id" element={<DetalleLibroAdminPage />} />
            <Route path="catalogo/nuevo" element={<NuevoLibroPage />} />
           */}
          <Route path="catalogo/nuevo" element={<NuevoMaterial />} />

          <Route path="perfil" element={<PerfilAdminPage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="sanciones" element={<AdminSancionesPage />} />
          <Route path="informes" element={<InformesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter