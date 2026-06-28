import { useState, useCallback } from 'react'
import { searchSanctionableLoans, getLoanForSanction } from '../../services/sanctions.services'

const formatFecha = (f) => {
  if (!f) return '—'
  const [a, m, d] = f.split('T')[0].split('-')
  return `${d}/${m}/${a}`
}

const BuscadorPrestamo = ({ tipoInfraccion, prestamo, onPrestamoSeleccionado, onQuitarPrestamo, bloqueado }) => {
  const [busqueda, setBusqueda]       = useState('')
  const [resultados, setResultados]   = useState([])
  const [buscando, setBuscando]       = useState(false)
  const [error, setError]             = useState(null)

  const buscar = useCallback(async () => {
    if (!busqueda.trim()) return
    try {
      setBuscando(true)
      setError(null)
      const data = await searchSanctionableLoans(busqueda.trim(), tipoInfraccion)
      setResultados(data)
      if (data.length === 0) setError('No se encontraron préstamos para ese término')
    } catch {
      setError('Error al buscar préstamos')
    } finally {
      setBuscando(false)
    }
  }, [busqueda, tipoInfraccion])

  const seleccionar = async (p) => {
    try {
      setBuscando(true)
      setResultados([])
      setBusqueda('')
      const data = await getLoanForSanction(p.id_prestamo)
      onPrestamoSeleccionado(data)
    } catch {
      setError('No se pudo cargar el préstamo')
    } finally {
      setBuscando(false)
    }
  }

  if (prestamo) {
    return (
      <div className="ns-card">
        <span className="ns-card__titulo">Préstamo seleccionado</span>
        <div className="ns-card__grid">
          <div className="sancion-card__item">
            <span className="sancion-card__label">Usuario</span>
            <span className="sancion-card__value">{prestamo.nombre_apellido}</span>
          </div>
          <div className="sancion-card__item">
            <span className="sancion-card__label">Correo</span>
            <span className="sancion-card__value">{prestamo.correo}</span>
          </div>
          <div className="sancion-card__item">
            <span className="sancion-card__label">Préstamo</span>
            <span className="sancion-card__value">#{prestamo.id_prestamo}</span>
          </div>
          <div className="sancion-card__item">
            <span className="sancion-card__label">Fecha tope</span>
            <span className="sancion-card__value">{formatFecha(prestamo.fecha_tope_devolucion)}</span>
          </div>
          <div className="sancion-card__item">
            <span className="sancion-card__label">Estado</span>
            <span className="sancion-card__value">{prestamo.estado_prestamo}</span>
          </div>
          <div className="sancion-card__item">
            <span className="sancion-card__label">CI</span>
            <span className="sancion-card__value">{prestamo.ci}</span>
          </div>
        </div>
        {!bloqueado && (
          <button type="button" className="sancion-btn sancion-btn--ghost" onClick={onQuitarPrestamo}>
            Cambiar préstamo
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="ns-buscador-wrap">
      <div className="ns-buscador">
        <input
          type="text"
          className="nueva-sancion-input"
          placeholder="Buscar por nombre, correo o CI del usuario..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); buscar() } }}
        />
        <button
          type="button"
          className="sancion-btn sancion-btn--primario"
          onClick={buscar}
          disabled={buscando}
        >
          {buscando ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {error && <p className="ns-hint ns-hint--error">{error}</p>}

      {resultados.length > 0 && (
        <div className="ns-resultados">
          {resultados.map(p => (
            <button
              type="button"
              key={p.id_prestamo}
              className="ns-resultado-item"
              onClick={() => seleccionar(p)}
            >
              <span className="ns-resultado-titulo">
                Préstamo #{p.id_prestamo} — {p.nombre_apellido}
              </span>
              <span className="ns-resultado-detalle">
                {p.correo} · CI: {p.ci} · Estado: {p.estado_prestamo} · Tope: {formatFecha(p.fecha_tope_devolucion)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default BuscadorPrestamo