import { useEffect, useRef, useState } from "react";
import { useAuth } from '../../context/AuthContext';
import "../styles/Navbar.css";
import logoFcyt from "../../assets/icons/LogoFCyT.png";
import NotificacionesBadge from '../../components/NotificacionesBadge'

const Navbar = ({
  onToggleSidebar,
  role = "user",
  onLogout,
  onSwitchRole,
  onViewProfile,
  className = "",
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const { user } = useAuth()

  const handleToggleProfileMenu = () => {
    setProfileMenuOpen((prev) => !prev);
  };

  const handleCloseProfileMenu = () => {
    setProfileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const multiplesRoles = user?.rol == "admin" || user?.rol == "bibliotecario"

  return (
    <header className={`app-navbar ${className}`}>
      <div className="app-navbar__left">
        <button
          className="app-navbar__menu-btn"
          onClick={onToggleSidebar}
          aria-label="Abrir menú lateral"
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="app-navbar__brand">
          <div className="app-navbar__logo-placeholder">
            <img src={logoFcyt} alt="Logo FCyT" className="app-navbar__logo" />
          </div>

          <div className="app-navbar__brand-text">
            <span className="app-navbar__faculty">
              Facultad de Ciencias y Tecnologías
            </span>
            <h1 className="app-navbar__title">Biblioteca FCyT</h1>
          </div>
        </div>
      </div>

      <div className="app-navbar__right">
        <a
          href="https://fctunca.edu.py/inicio/"
          target="_blank"
          rel="noreferrer"
          className="app-navbar__link-btn"
        >
          Ir a la web de la FCyT
        </a>

        <NotificacionesBadge />

        <div className="app-navbar__profile-wrapper" ref={profileMenuRef}>
          <button
            className="app-navbar__profile-btn"
            type="button"
            onClick={handleToggleProfileMenu}
            aria-label="Abrir menú de perfil"
          >
            <span>Mi perfil</span>
            <span className="app-navbar__profile-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
              </svg>
            </span>
          </button>

          {profileMenuOpen && (
            <div className="app-navbar__profile-menu">
              <button
                type="button"
                className="app-navbar__profile-menu-item"
                onClick={() => {
                  handleCloseProfileMenu();
                  if (onViewProfile) onViewProfile();
                }}
              >
                Ver mi perfil
              </button>

              {multiplesRoles && (
                <button
                  type="button"
                  className="app-navbar__profile-menu-item"
                  onClick={() => {
                    handleCloseProfileMenu();
                    if (onSwitchRole) onSwitchRole();
                  }}
                >
                  Cambiar rol
                </button>
              )}

              <button
                type="button"
                className="app-navbar__profile-menu-item app-navbar__profile-menu-item--danger"
                onClick={() => {
                  handleCloseProfileMenu();
                  if (onLogout) onLogout();
                }}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;