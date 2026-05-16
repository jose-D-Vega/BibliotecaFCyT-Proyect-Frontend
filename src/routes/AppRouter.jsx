import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'
import ScrollToTop from './ScrollToTop'


import UserLayout from '../layouts/UserLayout'
import AdminLayout from '../layouts/AdminLayout'

import CatalogoPublicPage from '../pages/public/CatalogoPublicPage'
import LibroDetallePublicPage from '../pages/public/LibroDetallePublicPage'
import LoginPage from '../pages/auth/LoginPage'
import AuthCallbackPage from '../pages/auth/AuthCallbackPage'
import RolSelectorPage from '../pages/auth/RolSelectorPage'
import CompletarPerfilPage from '../pages/auth/CompletarPerfilPage'

import DashboardUser from '../pages/user/DashboardUser'
import CatalogoUserPage from '../pages/user/CatalogoUserPage'
import DetalleLibroUserPage from '../pages/user/DetalleLibroUserPage'
import CarritoPage from '../pages/user/Carrito'
import PrestamosPage from '../pages/user/prueba/PrestamosPage'
import DevolucionesPage from '../pages/user/prueba/DevolucionesPage'
import SancionesPage from '../pages/user/prueba/SancionesPage'
import PerfilUserPage from '../pages/user/PerfilUserPage'

import AdminDashboardPage from '../pages/admin/DashboardAdmin'
import AdminPrestamosPage from '../pages/admin/prueba/AdminPrestamosPage'
import AdminDevolucionesPage from '../pages/admin/prueba/AdminDevolucionesPage'
import AdminCatalogoPage from '../pages/admin/AdminCatalogoPage'
import DetalleLibroAdminPage from '../pages/admin/DetalleLibroAdminPage'
import NuevoMaterial from '../pages/admin/NuevoMaterial'
import ModificarMaterial from '../pages/admin/ModificarMaterial'
import UsuariosPage from '../pages/admin/prueba/UsuariosPage'
import AdminSancionesPage from '../pages/admin/prueba/AdminSancionesPage'
import InformesPage from '../pages/admin/prueba/InformesPage'
import PerfilAdminPage from '../pages/admin/PerfilAdminPage'


const AppRouter = () => {
  const { user, loading, rolActivo } = useAuth()

  if (loading) return <div>Cargando...</div>

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>

        <Route path="/" element={<LoginPage />} />
        <Route path="/catalogo" element={<CatalogoPublicPage />} />
        <Route path="/catalogo/:id" element={<LibroDetallePublicPage />} />
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
          <Route path="inicio" element={<DashboardUser />} />
          <Route path="catalogo" element={<CatalogoUserPage />} />
          
          {/* ✅ Rutas activas para usuario */}
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
          
          {/* ✅ Rutas de admin con ID dinámico */}
          <Route path="catalogo/:id/editar" element={<ModificarMaterial />} />
          <Route path="catalogo/:id" element={<DetalleLibroAdminPage />} />
          
          <Route path="catalogo/nuevo" element={<NuevoMaterial />} />

          <Route path="perfil" element={<PerfilAdminPage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="sanciones" element={<AdminSancionesPage />} />
          <Route path="informes" element={<InformesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter