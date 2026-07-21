import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MdArrowBack } from 'react-icons/md'
import TabPrestamosActivos from '../../components/devoluciones/TabPrestamosActivos'
import TabHistorialDevoluciones from '../../components/devoluciones/TabHistorialDevoluciones'
import './styles/DevolucionesAdminPage.css'

const TABS = [
  { id: 'activos', label: 'Préstamos activos' },
  { id: 'historial', label: 'Historial de devoluciones' }
]

const DevolucionesPage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [tabActiva, setTabActiva] = useState(location.state?.tab || 'activos')
  const vieneDelDashboard = Boolean(location.state?.fromDashboard)

  const volverAlInicio = () => {
    navigate('/admin')
  }

  return (
    <div className="devoluciones-page">
      {vieneDelDashboard && (
        <button className="devoluciones-volver-btn" onClick={volverAlInicio}>
          <MdArrowBack size={18} />
          Volver al inicio
        </button>
      )}

      <h1 className="devoluciones-page__title">Devoluciones</h1>

      <div className="devoluciones-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`devoluciones-tab-btn ${tabActiva === tab.id ? 'activo' : ''}`}
            onClick={() => setTabActiva(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="devoluciones-tab-content">
        {tabActiva === 'activos' && <TabPrestamosActivos />}
        {tabActiva === 'historial' && <TabHistorialDevoluciones />}
      </div>
    </div>
  )
}

export default DevolucionesPage