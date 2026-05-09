import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logoCompleto from '../../assets/icons/logo-web-blanco.png'
import './Layout.css'

const ADMIN_NAV = [
  { path: '/admin/inicio',       label: 'Inicio' },
  { path: '/admin/prestamos',    label: 'Préstamos' },
  { path: '/admin/devoluciones', label: 'Devoluciones' },
  { path: '/admin/catalogo',     label: 'Catálogo' },
  { path: '/admin/usuarios',     label: 'Usuarios' },
  { path: '/admin/sanciones',    label: 'Sanciones' },
  { path: '/admin/informes',     label: 'Informes' },
]

const AdminLayout = () => {
  const { user, logout, switchRol } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleSwitchRol = () => {
    switchRol()
    navigate('/select-rol', { replace: true })
  }

  return (
    <div className="layout">

      {/* Navbar */}
      <header className="layout__navbar">
        <div className="layout__navbar-left">
          <button className="layout__hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Menú">
            <span /><span /><span />
          </button>
          <a href="http://fctunca.edu.py/" target="_blank" rel="noreferrer">
            <img src={logoCompleto} alt="FCyT UNCA" className="layout__logo" />
          </a>
        </div>

        <div className="layout__navbar-right">
          <a href="http://fctunca.edu.py/" target="_blank" rel="noreferrer" className="layout__nav-link">
            FCyT
          </a>
          <button className="layout__icon-btn" aria-label="Notificaciones">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          <div className="layout__profile">

            {/**El perfil del admin */}
            <div
              className="layout__avatar layout__avatar--admin"
              onClick={() => navigate('/admin/perfil')}
              style={{ cursor: 'pointer' }}
            >
              {user?.nombre?.charAt(0).toUpperCase()}
            </div>


            <div className="layout__profile-info">
              <span className="layout__profile-name">{user?.nombre}</span>
              <div className="layout__profile-actions">
                <button className="layout__switch" onClick={handleSwitchRol}>Cambiar rol</button>
                <span>·</span>
                <button className="layout__logout" onClick={handleLogout}>Salir</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="layout__body">

        {sidebarOpen && (
          <div className="layout__overlay" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`layout__sidebar ${sidebarOpen ? 'layout__sidebar--open' : ''}`}>
          <div className="layout__sidebar-header">
            <span className="layout__rol-badge">Bibliotecario</span>
          </div>
          <nav className="layout__nav">
            {ADMIN_NAV.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `layout__nav-item ${isActive ? 'layout__nav-item--active' : ''}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="layout__content">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default AdminLayout