import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './RolSelectorPage.css'; 

const RolSelectorPage = () => {
  const { user, selectRol } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (rol) => {
    selectRol(rol)
    if (rol === 'bibliotecario') {
      navigate('/admin/inicio', { replace: true })
    } else {
      navigate('/app/inicio', { replace: true })
    }
  }

  return (
    <div className="role-selector-container">
      <div className="role-card">
        <h1>Bienvenido, {user?.nombre || 'Usuario'}</h1>
        <p className="subtitle">Selecciona tu perfil de acceso para continuar</p>

        <div className="role-options">
          <button 
            className="role-btn user-role" 
            onClick={() => handleSelect('normal')}
          >
            <span className="icon">👤</span>
            <div className="btn-text">
              <h3>Usuario</h3>
              <p>Consultar catálogo y préstamos personales</p>
            </div>
          </button>

          <button 
            className="role-btn admin-role" 
            onClick={() => handleSelect('bibliotecario')}
          >
            <span className="icon">📚</span>
            <div className="btn-text">
              <h3>Bibliotecario</h3>
              <p>Gestionar inventario, usuarios y reportes</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RolSelectorPage;