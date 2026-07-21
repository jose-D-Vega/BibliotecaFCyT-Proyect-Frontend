import { NavLink } from "react-router-dom"
import {
  House,
  BookOpenCheck,
  Undo2,
  LibraryBig,
  TriangleAlert,
  ChartBar
} from "lucide-react"

import "./styles/SidebarAdmin.css"

const BIBLIOTECARIO_NAV = [
  { path: "/bibliotecario/inicio", label: "Inicio", icon: House },
  { path: "/bibliotecario/prestamos", label: "Préstamos", icon: BookOpenCheck },
  { path: "/bibliotecario/devoluciones", label: "Devoluciones", icon: Undo2 },
  { path: "/bibliotecario/catalogo", label: "Catálogo", icon: LibraryBig },
  { path: "/bibliotecario/sanciones", label: "Sanciones", icon: TriangleAlert },
  { path: "/bibliotecario/reportes", label: "Reportes", icon: ChartBar }
]

const SidebarBibliotecario = ({ isOpen, onClose, className = "" }) => {
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
            <h2 className="sidebar-admin__title">Menú Bibliotecario</h2>
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
          {BIBLIOTECARIO_NAV.map((item) => (
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
  )
}

export default SidebarBibliotecario