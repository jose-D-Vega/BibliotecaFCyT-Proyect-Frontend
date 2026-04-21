import { useEffect, useRef, useState } from "react";
import "./styles/Navbar.css";
import logoFcyt from "../assets/icons/LogoFCyT.png";

const Navbar = ({
  onToggleSidebar,
  role = "user",
  onLogout,
  onSwitchRole,
  onViewProfile,
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

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

  return (
    <header className="app-navbar">
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

        <button
          className="app-navbar__icon-btn"
          type="button"
          aria-label="Notificaciones"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path
              d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0H9m6 0a3 3 0 0 1-6 0"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

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

              {role === "admin" && (
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