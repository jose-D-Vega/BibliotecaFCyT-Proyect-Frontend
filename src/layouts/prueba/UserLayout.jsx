import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logoCompleto from '../../assets/icons/logo-web-blanco.png'
import './Layout.css'

//esto es un truco para no tener que repetir el codigo dentro del sidebar gracias a la funcion .map()
const USER_NAV = [
  { path: '/app/inicio',       label: 'Inicio' },
  { path: '/app/catalogo',     label: 'Catálogo' },
  { path: '/app/prestamos',    label: 'Préstamos' },
  { path: '/app/devoluciones', label: 'Devoluciones' },
  { path: '/app/sanciones',    label: 'Sanciones' },
]


const UserLayout = () => {
  const { user, logout } = useAuth() // para obtener los valores de useAuth, datos del usuario y la funcion logut
  const navigate = useNavigate() //importamos de ract router para poder navegar entre paginas
  const [sidebarOpen, setSidebarOpen] = useState(false) 

  const handleLogout = () => { // funcion para el boton de cerrar sesion
    logout()//funcion que permite cerrar sesion
    navigate('/login', { replace: true }) // funcion para ir a la pagina de login
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
            <div className="layout__avatar">
              {user?.nombre?.charAt(0).toUpperCase()}
            </div>
            <div className="layout__profile-info">
              <span className="layout__profile-name">{user?.nombre}</span>
              <button className="layout__logout" onClick={handleLogout}>Cerrar sesión</button>
            </div>
          </div>
        </div>
      </header>

      <div className="layout__body">

        {/* Overlay para cerrar sidebar en mobile */}
        {sidebarOpen && (
          <div className="layout__overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`layout__sidebar ${sidebarOpen ? 'layout__sidebar--open' : ''}`}>
          <nav className="layout__nav">
            {/* Aqui esta la logica para crear de manera automatica las secciones del sidebar con un NavLink */}
            {/* El NavLink es el componente que nos permite transportarno entre direcciones, ignora el className es solo para el css */}
            {USER_NAV.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `layout__nav-item ${isActive ? 'layout__nav-item--active' : ''}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                {/* Aqui se expresa el nombre de la seccion: inicio, catalogo, etc */}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className="layout__content">
          <Outlet />{/* Esto es lo mas importante es lo que se encarga de renderizar los pages segun la ruta */}
        </main>

      </div>
    </div>
  )
}

export default UserLayout