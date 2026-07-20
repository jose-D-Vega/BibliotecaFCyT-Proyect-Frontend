import { useEffect, useState, useRef } from 'react'
import { getLoans } from '../../services/loans.services'
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
      setPrestamos(res.data)
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

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPagina(nuevaPagina)
    }
  }

  const generarPaginas = () => {
    const paginas = []

    if (totalPaginas <= 7) {
      for (let i = 1; i <= totalPaginas; i++) {
        paginas.push(i)
      }
    } else {
      paginas.push(1)

      if (pagina > 4) {
        paginas.push('...')
      }

      const inicio = Math.max(2, pagina - 1)
      const fin = Math.min(totalPaginas - 1, pagina + 1)

      for (let i = inicio; i <= fin; i++) {
        paginas.push(i)
      }

      if (pagina < totalPaginas - 3) {
        paginas.push('...')
      }

      paginas.push(totalPaginas)
    }

    return paginas
  }

  return (
    <div>
      <div className="historial-filtros">
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
        <div className="prestamos-loading">
          <div className="prestamos-spinner"></div>
          <span>Cargando historial...</span>
        </div>
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
              <button
                onClick={() => cambiarPagina(1)}
                disabled={pagina === 1}
              >
                «
              </button>
              <button
                onClick={() => cambiarPagina(pagina - 1)}
                disabled={pagina === 1}
              >
                ‹
              </button>

              {generarPaginas().map((p, index) =>
                p === '...' ? (
                  <span key={index} className="historial-paginacion-puntos">
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    className={pagina === p ? 'active' : ''}
                    onClick={() => setPagina(p)}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => cambiarPagina(pagina + 1)}
                disabled={pagina === totalPaginas}
              >
                ›
              </button>
              <button
                onClick={() => cambiarPagina(totalPaginas)}
                disabled={pagina === totalPaginas}
              >
                »
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default HistorialPrestamos