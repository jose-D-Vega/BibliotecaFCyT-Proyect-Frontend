import { NavLink } from "react-router-dom";
import "./styles/SidebarAdmin.css";

const ADMIN_NAV = [
  { path: "/admin/inicio", label: "Inicio" },
  { path: "/admin/prestamos", label: "Préstamos" },
  { path: "/admin/devoluciones", label: "Devoluciones" },
  { path: "/admin/catalogo", label: "Catálogo" },
  { path: "/admin/sanciones", label: "Sanciones" },
  { path: "/admin/informes", label: "Informes" },
  { path: "/admin/usuarios", label: "Usuarios" },
];

const SidebarAdmin = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      ></div>

      <aside className={`sidebar sidebar-admin ${isOpen ? "open" : ""}`}>
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
              <span className="sidebar-admin__bullet"></span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default SidebarAdmin;