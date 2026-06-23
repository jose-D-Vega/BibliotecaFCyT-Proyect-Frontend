import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'
import ScrollToTop from './ScrollToTop'

import UserLayout from '../layouts/UserLayout'
import AdminLayout from '../layouts/AdminLayout'
import BibliotecarioLayout from '../layouts/BibliotecarioLayout'

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
import DevolucionesUserPage from '../pages/user/prueba/DevolucionesUserPage'
import SancionesPage from '../pages/user/prueba/SancionesPage'
import PerfilUserPage from '../pages/user/PerfilUserPage'

import AdminDashboardPage from '../pages/admin/DashboardAdmin'
import PrestamosAdminPage from '../pages/admin/PrestamosAdminPage'
import AdminDevolucionesPage from '../pages/admin/prueba/AdminDevolucionesPage'
import AdminCatalogoPage from '../pages/admin/AdminCatalogoPage'
import DetalleLibroAdminPage from '../pages/admin/DetalleLibroAdminPage'
import NuevoMaterial from '../pages/admin/NuevoMaterial'
import ModificarMaterial from '../pages/admin/ModificarMaterial'
import AdminSancionesPage from '../pages/admin/prueba/AdminSancionesPage'
import NuevaSancionPage from '../pages/admin/prueba/NuevaSancionPage'
import InformesPage from '../pages/admin/prueba/InformesPage'
import PerfilAdminPage from '../pages/admin/PerfilAdminPage'
import GestionPrestamosPage from '../pages/admin/prueba/GestionPrestamosPage'
import GestionUsuarios from '../pages/admin/GestionUsuarios'
import SancionesUserPage from '../pages/user/SancionesUserPage'

const AppRouter = () => {
  const { user, loading, rolActivo } = useAuth()

  if (loading) return <div>Cargando...</div>

  // Helper para saber si el usuario tiene rol de gestión
  const esGestion = user && ['bibliotecario', 'admin'].includes(user.rol)

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>

        {/* Públicas */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/catalogo" element={<CatalogoPublicPage />} />
        <Route path="/catalogo/:id" element={<LibroDetallePublicPage />} />

        <Route
          path="/login"
          element={
            user
              ? <Navigate to={esGestion ? '/select-rol' : '/app/inicio'} replace />
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
                ? <Navigate to={
                    rolActivo === 'admin' ? '/admin/inicio'
                    : rolActivo === 'bibliotecario' ? '/bibliotecario/inicio'
                    : '/app/inicio'
                  } replace />
                : <CompletarPerfilPage />
          }
        />

        <Route
          path="/select-rol"
          element={
            !user
              ? <Navigate to="/login" replace />
              : !esGestion
                ? <Navigate to="/app/inicio" replace />
                : <RolSelectorPage />
          }
        />

        {/* USUARIO NORMAL */}
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
          <Route path="catalogo/:id" element={<DetalleLibroUserPage />} />
          <Route path="carrito" element={<CarritoPage />} />
          <Route path="perfil" element={<PerfilUserPage />} />
          <Route path="prestamos" element={<PrestamosPage />} />
          <Route path="devoluciones" element={<DevolucionesUserPage />} />
          <Route path="sanciones" element={<SancionesUserPage />} />
        </Route>

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="inicio" replace />} />
          <Route path="inicio" element={<AdminDashboardPage />} />
          <Route path="prestamos" element={<PrestamosAdminPage />} />
          <Route path="devoluciones" element={<AdminDevolucionesPage />} />
          <Route path="catalogo" element={<AdminCatalogoPage />} />
          <Route path="catalogo/:id/editar" element={<ModificarMaterial />} />
          <Route path="catalogo/:id" element={<DetalleLibroAdminPage />} />
          <Route path="catalogo/nuevo" element={<NuevoMaterial />} />
          <Route path="perfil" element={<PerfilAdminPage />} />
          <Route path="usuarios" element={<GestionUsuarios />} />
          <Route path="sanciones/nueva" element={<NuevaSancionPage />} />
          <Route path="sanciones" element={<AdminSancionesPage />} />
          <Route path="informes" element={<InformesPage />} />
        </Route>

        {/* BIBLIOTECARIO */}
        <Route
          path="/bibliotecario"
          element={
            <ProtectedRoute requiredRole="bibliotecario">
              <BibliotecarioLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="inicio" replace />} />
          <Route path="inicio" element={<AdminDashboardPage />} />
          <Route path="prestamos" element={<GestionPrestamosPage />} />
          <Route path="devoluciones" element={<AdminDevolucionesPage />} />
          <Route path="catalogo" element={<AdminCatalogoPage />} />
          <Route path="catalogo/:id/editar" element={<ModificarMaterial />} />
          <Route path="catalogo/:id" element={<DetalleLibroAdminPage />} />
          <Route path="sanciones" element={<AdminSancionesPage />} />
          <Route path="informes" element={<InformesPage />} />
          {/* Sin: usuarios, catalogo/nuevo */}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter