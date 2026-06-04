import { useState, useEffect } from 'react'
import { getHistorialDevoluciones } from '../../services/returns.services'
import './DevolucionesComponents.css'

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const d = new Date(fecha)
  return d.toLocaleDateString('es-PY', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const ESTADO_COLORS = {
  bueno: 'badge--verde',
  deteriorado: 'badge--amarillo',
  danado: 'badge--rojo'
}

const ESTADO_LABELS = {
  bueno: 'Buen estado',
  deteriorado: 'Deteriorado',
  danado: 'Dañado'
}

const TabHistorialDevoluciones = () => {
  const [search, setSearch] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [devoluciones, setDevoluciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)

  const fetchHistorial = async (params = {}) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getHistorialDevoluciones({
        search: params.search ?? search,
        fecha_desde: params.fecha_desde ?? fechaDesde,
        fecha_hasta: params.fecha_hasta ?? fechaHasta,
        page: params.page ?? pagina,
        limit: 20
      })
      setDevoluciones(data.data)
      setTotalPaginas(data.pagination.totalPages)
    } catch {
      setError('Error al cargar el historial')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistorial()
  }, [pagina])

  const handleFiltrar = (e) => {
    e.preventDefault()
    setPagina(1)
    fetchHistorial({ page: 1 })
  }

  const handleLimpiar = () => {
    setSearch('')
    setFechaDesde('')
    setFechaHasta('')
    setPagina(1)
    fetchHistorial({ search: '', fecha_desde: '', fecha_hasta: '', page: 1 })
  }

  return (
    <div className="tab-content">
      <form className="historial-filtros" onSubmit={handleFiltrar}>
        <input
          type="text"
          placeholder="Buscar por nombre, cédula o correo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="tab-search__input"
        />
        <div className="historial-fechas">
          <input
            type="date"
            value={fechaDesde}
            onChange={e => setFechaDesde(e.target.value)}
            className="tab-search__input historial-fecha-input"
          />
          <span className="historial-fechas__sep">—</span>
          <input
            type="date"
            value={fechaHasta}
            onChange={e => setFechaHasta(e.target.value)}
            className="tab-search__input historial-fecha-input"
          />
        </div>
        <button type="submit" className="tab-search__btn">Filtrar</button>
        <button type="button" className="tab-search__clear" onClick={handleLimpiar}>
          Limpiar
        </button>
      </form>

      {loading && <p className="tab-loading">Cargando historial...</p>}
      {error && <p className="tab-error">{error}</p>}

      {!loading && !error && devoluciones.length === 0 && (
        <p className="tab-vacio">No se encontraron devoluciones.</p>
      )}

      {!loading && devoluciones.length > 0 && (
        <>
          <div className="historial-tabla">
            <div className="historial-tabla__header">
              <span>Usuario</span>
              <span>Libro</span>
              <span>Ejemplar</span>
              <span>Estado</span>
              <span>Fecha devolución</span>
              <span>Bibliotecario</span>
            </div>
            {devoluciones.map(dev => (
              <div key={dev.id_devolucion} className="historial-tabla__row">
                <div className="historial-tabla__cell">
                  <span className="historial-nombre">{dev.nombre_apellido}</span>
                  <span className="historial-detalle">{dev.correo}</span>
                </div>
                <div className="historial-tabla__cell">
                  <span className="historial-nombre">{dev.titulo}</span>
                  <span className="historial-detalle">{dev.autor}</span>
                </div>
                <div className="historial-tabla__cell">
                  <span>#{dev.id_ejemplar}</span>
                </div>
                <div className="historial-tabla__cell">
                  <span className={`pcard__badge ${ESTADO_COLORS[dev.estado_devuelto]}`}>
                    {ESTADO_LABELS[dev.estado_devuelto] || dev.estado_devuelto}
                  </span>
                  {dev.observaciones && (
                    <span className="historial-detalle">{dev.observaciones}</span>
                  )}
                </div>
                <div className="historial-tabla__cell">
                  <span>{formatFecha(dev.fecha_devolucion)}</span>
                </div>
                <div className="historial-tabla__cell">
                  <span>{dev.bibliotecario}</span>
                </div>
              </div>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="tab-paginacion">
              {Array.from({ length: totalPaginas }, (_, i) => (
                <button
                  key={i}
                  className={`tab-paginacion__btn ${pagina === i + 1 ? 'activo' : ''}`}
                  onClick={() => setPagina(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TabHistorialDevoluciones