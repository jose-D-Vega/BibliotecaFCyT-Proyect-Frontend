import { useState, useEffect } from 'react'
import { getPrestamosConDevoluciones } from '../../services/returns.services'
import HistorialPrestamoCard from './HistorialPrestamoCard'
import ModalDetalleDevolucion from './ModalDetalleDevolucion'
import './DevolucionesComponents.css'

const TabHistorialDevoluciones = () => {
  const [search, setSearch] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [prestamos, setPrestamos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [prestamoDetalle, setPrestamoDetalle] = useState(null)

  const fetchHistorial = async (params = {}) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPrestamosConDevoluciones({
        search: params.search ?? search,
        fecha_desde: params.fecha_desde ?? fechaDesde,
        fecha_hasta: params.fecha_hasta ?? fechaHasta,
        page: params.page ?? pagina,
        limit: 12
      })
      setPrestamos(data.data)
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
      <form className="historial-dev-filtros" onSubmit={handleFiltrar}>
        <input
          type="text"
          placeholder="Nombre, cédula o correo..."
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
        <div className='tab-btn'>
          <button type="submit" className="tab-search__btn">Filtrar</button>
          <button type="button" className="tab-search__clear" onClick={handleLimpiar}>
            Limpiar
          </button>
        </div>
        
      </form>

      {loading && <p className="tab-loading">Cargando historial...</p>}
      {error && <p className="tab-error">{error}</p>}

      {!loading && !error && prestamos.length === 0 && (
        <p className="tab-vacio">No se encontraron devoluciones.</p>
      )}

      {!loading && prestamos.length > 0 && (
        <>
          <div className="pcard-grid">
            {prestamos.map(p => (
              <HistorialPrestamoCard
                key={p.id_prestamo}
                prestamo={p}
                onVerDetalle={setPrestamoDetalle}
              />
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

      {prestamoDetalle && (
        <ModalDetalleDevolucion
          prestamo={prestamoDetalle}
          onCerrar={() => setPrestamoDetalle(null)}
          onActualizar={fetchHistorial}
        />
      )}
    </div>
  )
}

export default TabHistorialDevoluciones