import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

const AdminDashboardPage = () => {
  const { user, logout, switchRol } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleSwitchRol = () => {
    switchRol()
    navigate('/select-rol', { replace: true })
  }

  return (
    <div>
      <h1>Panel Bibliotecario</h1>
      <p>Bienvenido, {user?.nombre}</p>
      <button onClick={handleSwitchRol}>Cambiar rol</button>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  )
}

export default AdminDashboardPage