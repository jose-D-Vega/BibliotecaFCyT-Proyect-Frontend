import { NavLink } from "react-router-dom";
import "./styles/SidebarUser.css";

const USER_NAV = [
  { path: "/app/inicio", label: "Inicio" },
  { path: "/app/prestamos", label: "Préstamos" },
  { path: "/app/catalogo", label: "Catálogo" },
  { path: "/app/devoluciones", label: "Devoluciones" },
  { path: "/app/sanciones", label: "Sanciones" },
];

const SidebarUser = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      ></div>

      <aside className={`sidebar sidebar-user ${isOpen ? "open" : ""}`}>
        <div className="sidebar-user__header">
          <div>
            <p className="sidebar-user__subtitle">Panel del sistema</p>
            <h2 className="sidebar-user__title">Menú Usuario</h2>
          </div>

          <button
            className="sidebar-user__close"
            onClick={onClose}
            type="button"
            aria-label="Cerrar menú"
          >
            ×
          </button>
        </div>

        <nav className="sidebar-user__nav">
          {USER_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-user__item ${isActive ? "sidebar-user__item--active" : ""}`
              }
              onClick={onClose}
            >
              <span className="sidebar-user__bullet"></span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default SidebarUser;