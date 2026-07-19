import { useState } from 'react'
import TabPrestamosActivos from '../../components/devoluciones/TabPrestamosActivos'
import TabHistorialDevoluciones from '../../components/devoluciones/TabHistorialDevoluciones'
import './styles/DevolucionesAdminPage.css'

const TABS = [
  { id: 'activos', label: 'Préstamos activos' },
  { id: 'historial', label: 'Historial de devoluciones' }
]

const DevolucionesPage = () => {
  const [tabActiva, setTabActiva] = useState('activos')

  return (
    <div className="devoluciones-page">
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