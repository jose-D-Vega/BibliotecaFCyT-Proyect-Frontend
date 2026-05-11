import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logoFCyT from '../../assets/icons/LogoFCyT.png'
import './auth_styles/RolSelectorPage.css'

const RolSelectorPage = () => {
  const { user, selectRol } = useAuth()
  const navigate = useNavigate()

  const handleSelect = (rol) => {
    selectRol(rol)
    if (rol === 'bibliotecario') {
      navigate('/admin/inicio', { replace: true })
    } else {
      navigate('/app/inicio', { replace: true })
    }
  }

  return (
    <div className="rol-page">
      <div className="rol-card">

        <div className="rol-card__logo">
          <img src={logoFCyT} alt="FCyT" />
        </div>

        <div className="rol-card__body">
          <h1 className="rol-card__title">Biblioteca FCyT UNCA</h1>
          <p className="rol-card__welcome">Hola, {user?.nombre_apellido || user?.nombre || 'Usuario'}</p>
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

            <button className="rol-btn rol-btn--admin" onClick={() => handleSelect('bibliotecario')}>
              <span className="rol-btn__icon">📚</span>
              <div className="rol-btn__text">
                <h3>Bibliotecario</h3>
                <p>Gestioná inventario, préstamos y usuarios</p>
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