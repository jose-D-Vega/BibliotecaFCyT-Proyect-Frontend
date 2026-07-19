import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logoFCyT from '../../assets/icons/LogoFCyT.png'
import './styles/RolSelectorPage.css'

const RolSelectorPage = () => {
  const { user, selectRol } = useAuth()
  const navigate = useNavigate()

  const handleSelect = (rol) => {
    selectRol(rol)
    if (rol === 'normal') navigate('/app/inicio', { replace: true })
    else if (rol === 'bibliotecario') navigate('/bibliotecario/inicio', { replace: true })
    else if (rol === 'admin') navigate('/admin/inicio', { replace: true })
  }

  // El rol de gestión puede ser bibliotecario o admin
  const rolGestion = user?.rol // 'bibliotecario' o 'admin'
  const esAdmin = rolGestion === 'admin'

  return (
    <div className="rol-page">
      <div className="rol-card">
        <div className="rol-card__logo">
          <img src={logoFCyT} alt="FCyT" />
        </div>

        <div className="rol-card__body">
          <h1 className="rol-card__title">Biblioteca FCyT UNCA</h1>
          <p className="rol-card__welcome">Hola, {user?.nombre || 'Usuario'}</p>
          <p className="rol-card__desc">Seleccioná tu perfil de acceso para continuar</p>

          <div className="rol-options">
            <button className="rol-btn" onClick={() => handleSelect('normal')}>
              <span className="rol-btn__icon">👤</span>
              <div className="rol-btn__text">
                <h3>Usuario</h3>
                <p>Consultá el catálogo y tus préstamos personales</p>
              </div>
              <span className="rol-btn__arrow">→</span>
            </button>

            <button className="rol-btn rol-btn--admin" onClick={() => handleSelect(rolGestion)}>
              <span className="rol-btn__icon">{esAdmin ? '🔑' : '📚'}</span>
              <div className="rol-btn__text">
                <h3>{esAdmin ? 'Administrador' : 'Bibliotecario'}</h3>
                <p>{esAdmin
                  ? 'Control total del sistema, usuarios y reportes'
                  : 'Gestioná préstamos y devoluciones'
                }</p>
              </div>
              <span className="rol-btn__arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RolSelectorPage