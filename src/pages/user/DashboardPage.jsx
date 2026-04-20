import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const DashboardPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido, {user?.nombre}</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  )
}

export default DashboardPage