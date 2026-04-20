import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const RolSelectorPage = () => {
  const { user, selectRol } = useAuth()
  const navigate = useNavigate()

  const handleSelect = (rol) => {
    selectRol(rol)
    if (rol === 'bibliotecario') {
      navigate('/admin', { replace: true })
    } else {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <div>
      <h2>Hola, {user?.nombre}</h2>
      <p>¿Con qué rol deseas ingresar?</p>
      <button onClick={() => handleSelect('normal')}>
        Ingresar como usuario
      </button>
      <button onClick={() => handleSelect('bibliotecario')}>
        Ingresar como bibliotecario
      </button>
    </div>
  )
}

export default RolSelectorPage