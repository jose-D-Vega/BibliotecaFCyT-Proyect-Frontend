import { useEffect, useRef, useState } from 'react'
import { getLabelTipo } from '../../utils/notificacionTipos'
import './styles/NotificacionesFilters.css'

const ESTADOS = [
  { value: '', label: 'Todas' },
  { value: 'false', label: 'No leídas' },
  { value: 'true', label: 'Leídas' }
]

function NotificacionesFilters({
  tipos,
  tipoFiltro, setTipoFiltro,
  estadoFiltro, setEstadoFiltro,
  fechaDesde, setFechaDesde,
  fechaHasta, setFechaHasta
}) {
  const [openTipo, setOpenTipo] = useState(false)
  const [openEstado, setOpenEstado] = useState(false)
  const tipoRef = useRef(null)
  const estadoRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (tipoRef.current && !tipoRef.current.contains(event.target)) setOpenTipo(false)
      if (estadoRef.current && !estadoRef.current.contains(event.target)) setOpenEstado(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="notif-filters">

      <div className="notif-filter-dropdown" ref={tipoRef}>
        <button className="notif-filter-btn" onClick={() => setOpenTipo(!openTipo)}>
          <div className="notif-filter-btn__left">
            <span>Tipo</span>
            <span className="notif-filter-arrow">{openTipo ? '▲' : '▼'}</span>
          </div>
          <span className="notif-filter-selected">
            {tipoFiltro ? getLabelTipo(tipoFiltro) : 'Todos los tipos'}
          </span>
        </button>

        {openTipo && (
          <div className="notif-filter-menu">
            <button
              className={!tipoFiltro ? 'active' : ''}
              onClick={() => { setTipoFiltro(''); setOpenTipo(false) }}
            >
              Todos los tipos
            </button>
            {tipos.map((t) => (
              <button
                key={t}
                className={tipoFiltro === t ? 'active' : ''}
                onClick={() => { setTipoFiltro(t); setOpenTipo(false) }}
              >
                {getLabelTipo(t)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="notif-filter-dropdown" ref={estadoRef}>
        <button className="notif-filter-btn" onClick={() => setOpenEstado(!openEstado)}>
          <div className="notif-filter-btn__left">
            <span>Estado</span>
            <span className="notif-filter-arrow">{openEstado ? '▲' : '▼'}</span>
          </div>
          <span className="notif-filter-selected">
            {ESTADOS.find(e => e.value === estadoFiltro)?.label || 'Todas'}
          </span>
        </button>

        {openEstado && (
          <div className="notif-filter-menu">
            {ESTADOS.map((e) => (
              <button
                key={e.value}
                className={estadoFiltro === e.value ? 'active' : ''}
                onClick={() => { setEstadoFiltro(e.value); setOpenEstado(false) }}
              >
                {e.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="notif-filter-fecha">
        <label>Desde</label>
        <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
      </div>

      <div className="notif-filter-fecha">
        <label>Hasta</label>
        <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
      </div>

    </div>
  )
}

export default NotificacionesFilters