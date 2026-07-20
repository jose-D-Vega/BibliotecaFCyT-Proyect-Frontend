import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PrestamosActivos from '../../components/prestamos/PrestamosActivos'
import HistorialPrestamos from '../../components/prestamos/HistorialPrestamos'
import './styles/Prestamos.css'

const TABS = [
  { id: 'activos', label: 'Mis préstamos' },
  { id: 'historial', label: 'Historial' },
]

function PrestamosUserPage() {
  const [tabActiva, setTabActiva] = useState('activos')
  const navigate = useNavigate()

  return (
    <div className="prestamos-page">
      <header className="prestamos-header">
        <div className="prestamos-header__top">
          <h1>Préstamos</h1>
          <button
            className="prestamos-nuevo-btn"
            onClick={() => navigate('/app/catalogo')}
          >
            + Nuevo préstamo
          </button>
        </div>
        <div className="prestamos-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`prestamos-tab ${tabActiva === tab.id ? 'active' : ''}`}
              onClick={() => setTabActiva(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="prestamos-body">
        {tabActiva === 'activos' && <PrestamosActivos />}
        {tabActiva === 'historial' && <HistorialPrestamos />}
      </div>
    </div>
  )
}

export default PrestamosUserPage
