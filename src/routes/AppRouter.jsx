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
import LibroDetalleUserPage from '../pages/user/LibroDetalleUserPage'
import MisSolicitudesPage from '../pages/user/MisSolicitudesPage'
import PrestamosUserPage from '../pages/user/PrestamosUserPage'
import DevolucionesUserPage from '../pages/user/DevolucionesUserPage'
import SancionesUserPage from '../pages/user/SancionesUserPage'

import PerfilUserPage from '../pages/user/PerfilUserPage'
import NotificacionesPage from '../pages/NotificacionesPage'

// Dashboard de admin: placeholder temporal hasta que se desarrolle el real
import AdminDashboardPage from '../pages/admin/DashboardAdmin'
// Dashboard de bibliotecario: el que ya está desarrollado y funcionando
import BibliotecarioDashboardPage from '../pages/bibliotecario/DashboardBiblio'

import PrestamosAdminPage from '../pages/admin/PrestamosAdminPage'
import DevolucionesAdminPage from '../pages/admin/DevolucionesAdminPage'
import CatalogoAdminPage from '../pages/admin/CatalogoAdminPage'
import LibroDetalleAdminPage from '../pages/admin/LibroDetalleAdminPage'
import LibroDetalleBibliotecarioPage from '../pages/bibliotecario/LibroDetalleBibliotecarioPage'
import NuevoMaterial from '../pages/admin/NuevoMaterial'
import ModificarMaterial from '../pages/admin/ModificarMaterial'
import SancionesAdminPage from '../pages/admin/SancionesAdminPage'
import NuevaSancionPage from '../pages/admin/NuevaSancionPage'
import ReportesAdminPage from '../pages/admin/ReportesAdminPage'
import ReportesBibliotecarioPage from '../pages/bibliotecario/ReportesBibliotecarioPage'
import ActividadesAdminPage from '../pages/admin/ActividadesAdminPage'
import PerfilAdminPage from '../pages/admin/PerfilAdminPage'
import PerfilBibliotecarioPage from '../pages/bibliotecario/PerfilBibliotecarioPage'
import GestionUsuarios from '../pages/admin/GestionUsuarios'
import DetalleSancionesPrestamoPage from '../pages/admin/DetalleSancionesPrestamoPage'
import DetalleSancionesComportamientoPage from '../pages/admin/DetalleSancionesComportamientoPage'
import SesionesAdmin from '../pages/admin/SesionesAdmin'


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
          <Route path="notificaciones" element={<NotificacionesPage />} /> 
          <Route path="catalogo" element={<CatalogoUserPage />} />
          <Route path="catalogo/:id" element={<LibroDetalleUserPage />} />
          <Route path="solicitudes" element={<MisSolicitudesPage />} />
          <Route path="perfil" element={<PerfilUserPage />} />
          <Route path="prestamos" element={<PrestamosUserPage />} />
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
          <Route path="notificaciones" element={<NotificacionesPage />} /> 
          <Route path="prestamos" element={<PrestamosAdminPage />} />
          <Route path="devoluciones" element={<DevolucionesAdminPage />} />
          <Route path="catalogo" element={<CatalogoAdminPage />} />
          <Route path="catalogo/:id/editar" element={<ModificarMaterial />} />
          <Route path="catalogo/:id" element={<LibroDetalleAdminPage />} />
          <Route path="catalogo/nuevo" element={<NuevoMaterial />} />
          <Route path="perfil" element={<PerfilAdminPage />} />
          <Route path="usuarios" element={<GestionUsuarios />} />
          <Route path="sesiones" element={<SesionesAdmin />} />
          <Route path="sanciones/nueva" element={<NuevaSancionPage />} />
          <Route path="sanciones/prestamo/:id_prestamo" element={<DetalleSancionesPrestamoPage />} />
          <Route path="sanciones/comportamiento/:id_usuario" element={<DetalleSancionesComportamientoPage />} />
          <Route path="sanciones" element={<SancionesAdminPage />} />
          <Route path="reportes" element={<ReportesAdminPage />} />
          <Route path="actividades" element={<ActividadesAdminPage />} />
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
          <Route path="inicio" element={<BibliotecarioDashboardPage />} />
          <Route path="notificaciones" element={<NotificacionesPage />} /> 
          <Route path="prestamos" element={<PrestamosAdminPage />} />
          <Route path="devoluciones" element={<DevolucionesAdminPage />} />
          <Route path="catalogo" element={<CatalogoAdminPage />} />
          <Route path="catalogo/:id/editar" element={<ModificarMaterial />} />
          <Route path="catalogo/:id" element={<LibroDetalleBibliotecarioPage />} />
          <Route path="catalogo/nuevo" element={<NuevoMaterial />} />
          <Route path="perfil" element={<PerfilBibliotecarioPage />} />
          <Route path="sanciones/nueva" element={<NuevaSancionPage />} />
          <Route path="sanciones/prestamo/:id_prestamo" element={<DetalleSancionesPrestamoPage />} />
          <Route path="sanciones/comportamiento/:id_usuario" element={<DetalleSancionesComportamientoPage />} />
          <Route path="sanciones" element={<SancionesAdminPage />} />
          <Route path="reportes" element={<ReportesBibliotecarioPage />} />
          {/* Sin: usuarios, catalogo/nuevo */}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter