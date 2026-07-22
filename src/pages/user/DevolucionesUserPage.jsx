import { useState, useEffect } from 'react'
import { getDevolucionesUsuario } from '../../services/returns.services'
import ModalDetalleDevolucion from '../../components/devoluciones/ModalDetalleDevolucion'
import './styles/DevolucionesUserPage.css'

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const partes = fecha.split('T')[0].split('-')
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

const DevolucionesUserPage = () => {
  const [search, setSearch] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [devoluciones, setDevoluciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [prestamoDetalle, setPrestamoDetalle] = useState(null)

  const fetchDevoluciones = async (params = {}) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getDevolucionesUsuario({
        search: params.search ?? search,
        fecha_desde: params.fecha_desde ?? fechaDesde,
        fecha_hasta: params.fecha_hasta ?? fechaHasta,
        page: params.page ?? pagina,
        limit: 12
      })
      setDevoluciones(data.data)
      setTotalPaginas(data.pagination.totalPages)
    } catch {
      setError('Error al cargar tus devoluciones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDevoluciones()
  }, [pagina])

  const handleFiltrar = (e) => {
    e.preventDefault()
    setPagina(1)
    fetchDevoluciones({ page: 1 })
  }

  const handleLimpiar = () => {
    setSearch('')
    setFechaDesde('')
    setFechaHasta('')
    setPagina(1)
    fetchDevoluciones({ search: '', fecha_desde: '', fecha_hasta: '', page: 1 })
  }

  return (
    <div className="dev-user-page">
      <h1 className="dev-user-page__title">Mis devoluciones</h1>

      <form className="dev-user-filtros" onSubmit={handleFiltrar}>
        <input
          type="text"
          placeholder="Buscar por título del material..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="dev-user-input"
        />
        <div className="dev-user-fechas">
          <input
            type="date"
            value={fechaDesde}
            onChange={e => setFechaDesde(e.target.value)}
            className="dev-user-input dev-user-fecha"
          />
          <span className="dev-user-fechas__sep">—</span>
          <input
            type="date"
            value={fechaHasta}
            onChange={e => setFechaHasta(e.target.value)}
            className="dev-user-input dev-user-fecha"
          />
        </div>
        <button type="submit" className="dev-user-btn">Filtrar</button>
        <button type="button" className="dev-user-btn dev-user-btn--ghost" onClick={handleLimpiar}>
          Limpiar
        </button>
      </form>

      {loading && (
        <div className="dev-user-loader">
          <div className="dev-user-spinner"></div>
          <p>Cargando devoluciones...</p>
        </div>
      )}
      {error && <p className="dev-user-error">{error}</p>}

      {!loading && !error && devoluciones.length === 0 && (
        <p className="dev-user-vacio">No tenés devoluciones registradas.</p>
      )}

      {!loading && devoluciones.length > 0 && (
        <>
          <div className="dev-user-grid">
            {devoluciones.map(dev => {
              const devueltoCompleto = parseInt(dev.ejemplares_devueltos) === parseInt(dev.total_ejemplares)
              const tieneProblemas = dev.tiene_problemas
              const esRenovacion = dev.numero_renovacion > 0

              let estadoCard = 'completo'
              if (!devueltoCompleto) estadoCard = 'parcial'
              if (tieneProblemas) estadoCard = 'problema'

              return (
                <div key={dev.id_prestamo} className={`dev-user-card dev-user-card--${estadoCard}`}>
                  <div className="dev-user-card__header">
                    <div className="dev-user-card__badges">
                      <span className={`dev-user-badge ${estadoCard === 'completo' ? 'badge--verde' : estadoCard === 'problema' ? 'badge--rojo' : 'badge--amarillo'}`}>
                        {estadoCard === 'completo' ? 'Devuelto' : estadoCard === 'problema' ? 'Con observaciones' : 'Parcial'}
                      </span>
                      {esRenovacion && (
                        <span className="dev-user-badge badge--renovacion">
                          Renovación #{dev.numero_renovacion}
                        </span>
                      )}
                      {dev.es_reserva && (
                        <span className="dev-user-badge badge--reserva">Reserva</span>
                      )}
                    </div>
                    <span className="dev-user-card__id">Préstamo #{dev.id_prestamo}</span>
                  </div>

                  <div className="dev-user-card__info">
                    <div className="dev-user-card__item">
                      <span className="dev-user-card__label">Activado</span>
                      <span className="dev-user-card__value">{formatFecha(dev.fecha_activacion)}</span>
                    </div>
                    <div className="dev-user-card__item">
                      <span className="dev-user-card__label">Fecha tope</span>
                      <span className="dev-user-card__value">{formatFecha(dev.fecha_tope_devolucion)}</span>
                    </div>
                    <div className="dev-user-card__item">
                      <span className="dev-user-card__label">Última devolución</span>
                      <span className="dev-user-card__value">{formatFecha(dev.ultima_devolucion)}</span>
                    </div>
                    <div className="dev-user-card__item">
                      <span className="dev-user-card__label">Ejemplares</span>
                      <span className="dev-user-card__value">
                        {dev.ejemplares_devueltos}/{dev.total_ejemplares} devueltos
                      </span>
                    </div>
                  </div>

                  <button
                    className="dev-user-card__btn"
                    onClick={() => setPrestamoDetalle(dev)}
                  >
                    Ver detalle
                  </button>
                </div>
              )
            })}
          </div>

          {totalPaginas > 1 && (
          <div className="dev-user-paginacion">

            <button
              className="dev-user-pag-btn"
              disabled={pagina === 1}
              onClick={() => setPagina(1)}
            >
              «
            </button>

            <button
              className="dev-user-pag-btn"
              disabled={pagina === 1}
              onClick={() => setPagina(pagina - 1)}
            >
              ‹
            </button>


            {Array.from({ length: totalPaginas }, (_, i) => i + 1)
              .filter(num => {
                if (totalPaginas <= 7) return true

                if (num === 1 || num === totalPaginas) return true

                return Math.abs(num - pagina) <= 2
              })
              .map((num, index, arr) => (
                <span key={num}>
                  {index > 0 && num - arr[index - 1] > 1 && (
                    <span className="dev-user-pag-dots">...</span>
                  )}

                  <button
                    className={`dev-user-pag-btn ${pagina === num ? 'activo' : ''}`}
                    onClick={() => setPagina(num)}
                  >
                    {num}
                  </button>
                </span>
              ))
            }


            <button
              className="dev-user-pag-btn"
              disabled={pagina === totalPaginas}
              onClick={() => setPagina(pagina + 1)}
            >
              ›
            </button>

            <button
              className="dev-user-pag-btn"
              disabled={pagina === totalPaginas}
              onClick={() => setPagina(totalPaginas)}
            >
              »
            </button>

          </div>
        )}

        </>
      )}

      {prestamoDetalle && (
        <ModalDetalleDevolucion
          prestamo={prestamoDetalle}
          onCerrar={() => setPrestamoDetalle(null)}
          readOnly
        />
      )}
    </div>
  )
}

export default DevolucionesUserPage