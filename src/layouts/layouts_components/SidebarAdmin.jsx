import { NavLink } from "react-router-dom"
import {
  House,
  BookOpenCheck,
  Undo2,
  LibraryBig,
  TriangleAlert,
  ChartBar,
  Users,
  ShieldCheck
} from "lucide-react"

import "../styles/SidebarAdmin.css"

const ADMIN_NAV = [
  { path: "/admin/inicio", label: "Inicio", icon: House },
  { path: "/admin/prestamos", label: "Préstamos", icon: BookOpenCheck },
  { path: "/admin/devoluciones", label: "Devoluciones", icon: Undo2 },
  { path: "/admin/catalogo", label: "Catálogo", icon: LibraryBig },
  { path: "/admin/sanciones", label: "Sanciones", icon: TriangleAlert },
  { path: "/admin/reportes", label: "Reportes", icon: ChartBar },
  { path: "/admin/actividades", label: "Historial de actividades" },
  { path: "/admin/usuarios", label: "Usuarios", icon: Users },
  { path: "/admin/sesiones", label: "Sesiones", icon: ShieldCheck }
]

const SidebarAdmin = ({ isOpen, onClose, className = "", }) => {
  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""} ${className}`}
        onClick={onClose}
      ></div>

      <aside className={`sidebar sidebar-admin ${isOpen ? "open" : ""} ${className}`}>
        <div className="sidebar-admin__header">
          <div>
            <p className="sidebar-admin__subtitle">Panel de gestión</p>
            <h2 className="sidebar-admin__title">Menú Administrador</h2>
          </div>

          <button
            className="sidebar-admin__close"
            onClick={onClose}
            type="button"
            aria-label="Cerrar menú"
          >
            ×
          </button>
        </div>

        <nav className="sidebar-admin__nav">
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-admin__item ${isActive ? "sidebar-admin__item--active" : ""}`
              }
              onClick={onClose}
            >
              <item.icon className="sidebar-admin__icon" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default SidebarAdmin;