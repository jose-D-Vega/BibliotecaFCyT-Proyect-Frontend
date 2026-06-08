import { useEffect, useState, useRef } from 'react'
import { getLoans, getLoanById } from '../../services/loans.services'
import PrestamoCard from './PrestamoCard'

const ESTADOS = [
  { value: '', label: 'Todos los estados' },
  { value: 'solicitado', label: 'Solicitado' },
  { value: 'aprobado', label: 'Aprobado' },
  { value: 'parcialmente_aprobado', label: 'Parcialmente aprobado' },
  { value: 'activo', label: 'Activo' },
  { value: 'devuelto', label: 'Devuelto' },
  { value: 'vencido', label: 'Vencido' },
  { value: 'cancelado', label: 'Cancelado' },
  { value: 'rechazado', label: 'Rechazado' },
  { value: 'solicitud_reserva', label: 'Reserva solicitada' },
  { value: 'reserva_aprobada', label: 'Reserva aprobada' },
  { value: 'solicitud_renovacion', label: 'Renovación solicitada' },
]

const LIMIT = 10

function HistorialPrestamos() {
  const [prestamos, setPrestamos] = useState([])
  const [loading, setLoading] = useState(true)
  const [estado, setEstado] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [estadoOpen, setEstadoOpen] = useState(false)
  const estadoRef = useRef(null)

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handler = (e) => {
      if (estadoRef.current && !estadoRef.current.contains(e.target)) {
        setEstadoOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const cargarHistorial = async () => {
    setLoading(true)
    try {
      const params = {
        limit: LIMIT,
        page: pagina,
        ...(estado && { estado }),
        ...(fechaDesde && { fecha_desde: fechaDesde }),
        ...(fechaHasta && { fecha_hasta: fechaHasta }),
      }

      const res = await getLoans(params)
      setTotalPaginas(res.pagination.totalPages)

      const conDetalles = await Promise.all(
        res.data.map(p => getLoanById(p.id_prestamo))
      )
      setPrestamos(conDetalles)
    } catch (err) {
      console.error('Error al cargar historial:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { setPagina(1) }, [estado, fechaDesde, fechaHasta])
  useEffect(() => { cargarHistorial() }, [pagina, estado, fechaDesde, fechaHasta])

  const hayFiltros = estado || fechaDesde || fechaHasta
  const estadoLabel = ESTADOS.find(e => e.value === estado)?.label || 'Todos los estados'

  return (
    <div>
      {/* Filtros */}
      <div className="historial-filtros">

        {/* Dropdown estado custom — siempre abre hacia abajo */}
        <div className="historial-dropdown" ref={estadoRef}>
          <button
            className={`historial-dropdown-btn ${estado ? 'activo' : ''}`}
            onClick={() => setEstadoOpen(o => !o)}
          >
            <span>{estadoLabel}</span>
            <span className={`historial-dropdown-arrow ${estadoOpen ? 'open' : ''}`}>▼</span>
          </button>
          {estadoOpen && (
            <div className="historial-dropdown-menu">
              {ESTADOS.map(e => (
                <div
                  key={e.value}
                  className={`historial-dropdown-option ${estado === e.value ? 'activo' : ''}`}
                  onClick={() => { setEstado(e.value); setEstadoOpen(false) }}
                >
                  {e.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fecha desde */}
        <div className="historial-fecha-wrapper">
          <label className="historial-fecha-label">Desde</label>
          <input
            type="date"
            className="historial-filtro-input"
            value={fechaDesde}
            onChange={e => setFechaDesde(e.target.value)}
            max={fechaHasta || undefined}
          />
        </div>

        {/* Fecha hasta */}
        <div className="historial-fecha-wrapper">
          <label className="historial-fecha-label">Hasta</label>
          <input
            type="date"
            className="historial-filtro-input"
            value={fechaHasta}
            onChange={e => setFechaHasta(e.target.value)}
            min={fechaDesde || undefined}
          />
        </div>

        {hayFiltros && (
          <button
            className="historial-limpiar-btn"
            onClick={() => { setEstado(''); setFechaDesde(''); setFechaHasta('') }}
          >
            Limpiar
          </button>
        )}
      </div>

      {loading ? (
        <p className="prestamos-loading">Cargando historial...</p>
      ) : prestamos.length === 0 ? (
        <p className="prestamos-vacio">No hay préstamos que coincidan con los filtros.</p>
      ) : (
        <>
          <div className="prestamos-lista">
            {prestamos.map(p => (
              <PrestamoCard key={p.id_prestamo} prestamo={p} onAccion={cargarHistorial} />
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="historial-paginacion">
              {Array.from({ length: totalPaginas }, (_, i) => (
                <button
                  key={i}
                  className={pagina === i + 1 ? 'active' : ''}
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

export default HistorialPrestamos
