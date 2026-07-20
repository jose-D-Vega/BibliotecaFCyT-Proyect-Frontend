import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getLoans, getLoanById, respondDetalle, activateLoan, cancelLoan } from '../../../services/loans.services'

const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'solicitado', label: 'Solicitados' },
  { value: 'aprobado', label: 'Aprobados' },
  { value: 'parcialmente_aprobado', label: 'Parcialmente aprobados' },
  { value: 'activo', label: 'Activos' },
  { value: 'solicitud_renovacion', label: 'Solicitudes de renovación' },
  { value: 'solicitud_reserva', label: 'Solicitudes de reserva' },
  { value: 'reserva_aprobada', label: 'Reservas aprobadas' },
  { value: 'rechazado', label: 'Rechazados' },
  { value: 'devuelto', label: 'Devueltos' },
  { value: 'vencido', label: 'Vencidos' },
]

const ESTADO_COLORS = {
  solicitado: '#93c5fd',
  aprobado: '#7de3b8',
  parcialmente_aprobado: '#fcd34d',
  rechazado: '#f09595',
  activo: '#7de3b8',
  devuelto: '#7de3b8',
  vencido: '#f09595',
  cancelado: '#aaa',
  solicitud_renovacion: '#c4b5fd',
  solicitud_reserva: '#93c5fd',
  reserva_aprobada: '#7de3b8',
  reserva_parcialmente_aprobada: '#fcd34d',
  pendiente_devolucion: '#fcd34d',
}

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const partes = fecha.split('T')[0].split('-')
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

const ESTADOS_APROBABLES = ['solicitado', 'solicitud_reserva', 'solicitud_renovacion']
const ESTADOS_ACTIVABLES = ['aprobado', 'parcialmente_aprobado']
const ESTADOS_CANCELABLES = ['solicitado', 'aprobado', 'parcialmente_aprobado', 'solicitud_reserva']

const GestionPrestamosPage = () => {
  const location = useLocation()

  const [filtroEstado, setFiltroEstado] = useState(location.state?.filtroEstado || '')
  const [prestamos, setPrestamos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [prestamoDetalle, setPrestamoDetalle] = useState(null)
  const [loadingDetalle, setLoadingDetalle] = useState(false)
  const [loadingAccion, setLoadingAccion] = useState(false)
  const [mensajeAccion, setMensajeAccion] = useState(null)

  // Si llega un nuevo state de navegación (ej. desde una tarjeta del dashboard), aplicarlo
  useEffect(() => {
    if (location.state?.filtroEstado !== undefined) {
      setFiltroEstado(location.state.filtroEstado)
      setPage(1)
    }
  }, [location.state])

  const fetchPrestamos = async (estado, pagina) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getLoans({ estado, page: pagina, limit: 15 })
      setPrestamos(data.data)
      setTotalPages(data.pagination.totalPages)
    } catch {
      setError('Error al cargar préstamos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrestamos(filtroEstado, page)
  }, [filtroEstado, page])

  const handleVerDetalle = async (id) => {
    try {
      setLoadingDetalle(true)
      setMensajeAccion(null)
      const data = await getLoanById(id)
      setPrestamoDetalle(data)
    } catch {
      setMensajeAccion({ tipo: 'error', texto: 'Error al cargar el detalle' })
    } finally {
      setLoadingDetalle(false)
    }
  }

  const handleResponder = async (id_ejemplar, estado) => {
    try {
      setLoadingAccion(true)
      setMensajeAccion(null)
      await respondDetalle(prestamoDetalle.id_prestamo, id_ejemplar, estado)
      setMensajeAccion({ tipo: 'ok', texto: `Ejemplar #${id_ejemplar} marcado como ${estado}` })
      await handleVerDetalle(prestamoDetalle.id_prestamo)
      fetchPrestamos(filtroEstado, page)
    } catch (err) {
      setMensajeAccion({ tipo: 'error', texto: err.response?.data?.error || 'Error al responder' })
    } finally {
      setLoadingAccion(false)
    }
  }

  const handleActivar = async () => {
    try {
      setLoadingAccion(true)
      setMensajeAccion(null)
      await activateLoan(prestamoDetalle.id_prestamo)
      setMensajeAccion({ tipo: 'ok', texto: 'Préstamo activado correctamente' })
      await handleVerDetalle(prestamoDetalle.id_prestamo)
      fetchPrestamos(filtroEstado, page)
    } catch (err) {
      setMensajeAccion({ tipo: 'error', texto: err.response?.data?.error || 'Error al activar' })
    } finally {
      setLoadingAccion(false)
    }
  }

  const handleCancelar = async () => {
    if (!window.confirm('¿Cancelar este préstamo?')) return
    try {
      setLoadingAccion(true)
      setMensajeAccion(null)
      await cancelLoan(prestamoDetalle.id_prestamo)
      setMensajeAccion({ tipo: 'ok', texto: 'Préstamo cancelado' })
      setPrestamoDetalle(null)
      fetchPrestamos(filtroEstado, page)
    } catch (err) {
      setMensajeAccion({ tipo: 'error', texto: err.response?.data?.error || 'Error al cancelar' })
    } finally {
      setLoadingAccion(false)
    }
  }

  const handleAprobarTodos = async () => {
    if (!window.confirm('¿Aprobar todos los ejemplares solicitados?')) return
    try {
      setLoadingAccion(true)
      setMensajeAccion(null)
      const detallesPendientes = prestamoDetalle.detalles.filter(
        d => d.estado_prestamo_ejemplar === 'solicitado'
      )
      for (const det of detallesPendientes) {
        await respondDetalle(prestamoDetalle.id_prestamo, det.id_ejemplar, 'aprobado')
      }
      setMensajeAccion({ tipo: 'ok', texto: 'Todos los ejemplares aprobados' })
      await handleVerDetalle(prestamoDetalle.id_prestamo)
      fetchPrestamos(filtroEstado, page)
    } catch (err) {
      setMensajeAccion({ tipo: 'error', texto: err.response?.data?.error || 'Error al aprobar' })
    } finally {
      setLoadingAccion(false)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', fontFamily: 'sans-serif', color: '#fff' }}>

      {/* COLUMNA IZQUIERDA — lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Gestión de préstamos</h1>

        {/* Filtro */}
        <select
          value={filtroEstado}
          onChange={e => { setFiltroEstado(e.target.value); setPage(1) }}
          style={{ padding: '0.5rem', borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontFamily: 'inherit' }}
        >
          {ESTADOS.map(e => (
            <option key={e.value} value={e.value} style={{ background: '#0c1a2e' }}>{e.label}</option>
          ))}
        </select>

        {loading && <p style={{ color: 'rgba(255,255,255,0.4)' }}>Cargando...</p>}
        {error && <p style={{ color: '#f09595' }}>{error}</p>}

        {!loading && prestamos.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>No hay préstamos.</p>
        )}

        {/* Lista */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {prestamos.map(p => (
            <div
              key={p.id_prestamo}
              onClick={() => handleVerDetalle(p.id_prestamo)}
              style={{
                padding: '0.875rem 1rem',
                background: prestamoDetalle?.id_prestamo === p.id_prestamo
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${prestamoDetalle?.id_prestamo === p.id_prestamo
                  ? 'rgba(255,255,255,0.25)'
                  : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 10,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.nombre_apellido}</span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                  #{p.id_prestamo} · {p.es_reserva ? 'Reserva' : 'Préstamo'} · {formatFecha(p.fecha_solicitud)}
                </span>
                {p.fecha_tope_devolucion && (
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                    Vence: {formatFecha(p.fecha_tope_devolucion)}
                  </span>
                )}
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.08)',
                color: ESTADO_COLORS[p.estado_prestamo] || '#fff',
                whiteSpace: 'nowrap'
              }}>
                {p.estado_prestamo}
              </span>
            </div>
          ))}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  padding: '0.35rem 0.7rem',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: page === i + 1 ? '#fff' : 'rgba(255,255,255,0.05)',
                  color: page === i + 1 ? '#0c1a2e' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  fontWeight: page === i + 1 ? 700 : 400
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* COLUMNA DERECHA — detalle */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 14,
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minHeight: 400
      }}>
        {!prestamoDetalle && !loadingDetalle && (
          <p style={{ color: 'rgba(255,255,255,0.3)', margin: 'auto', textAlign: 'center' }}>
            Seleccioná un préstamo para ver el detalle
          </p>
        )}

        {loadingDetalle && <p style={{ color: 'rgba(255,255,255,0.4)' }}>Cargando detalle...</p>}

        {prestamoDetalle && !loadingDetalle && (
          <>
            {/* Info del préstamo */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: '1.1rem' }}>
                  Préstamo #{prestamoDetalle.id_prestamo}
                </h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
                  {prestamoDetalle.nombre_apellido} · {prestamoDetalle.correo}
                </p>
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.08)',
                color: ESTADO_COLORS[prestamoDetalle.estado_prestamo] || '#fff'
              }}>
                {prestamoDetalle.estado_prestamo}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: 'rgba(255,255,255,0.35)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>Solicitado</span>
                <span>{formatFecha(prestamoDetalle.fecha_solicitud)}</span>
              </div>
              {prestamoDetalle.fecha_respuesta && (
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.35)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>Respondido</span>
                  <span>{formatFecha(prestamoDetalle.fecha_respuesta)}</span>
                </div>
              )}
              {prestamoDetalle.fecha_tope_devolucion && (
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.35)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>Vence</span>
                  <span>{formatFecha(prestamoDetalle.fecha_tope_devolucion)}</span>
                </div>
              )}
              {prestamoDetalle.numero_renovacion > 0 && (
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.35)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>Renovación</span>
                  <span>#{prestamoDetalle.numero_renovacion}</span>
                </div>
              )}
            </div>

            {/* Mensaje de acción */}
            {mensajeAccion && (
              <p style={{
                margin: 0,
                padding: '0.6rem 1rem',
                borderRadius: 8,
                fontSize: '0.85rem',
                background: mensajeAccion.tipo === 'ok' ? 'rgba(29,158,117,0.15)' : 'rgba(163,51,51,0.15)',
                color: mensajeAccion.tipo === 'ok' ? '#7de3b8' : '#f09595',
                border: `1px solid ${mensajeAccion.tipo === 'ok' ? 'rgba(29,158,117,0.3)' : 'rgba(163,51,51,0.3)'}`
              }}>
                {mensajeAccion.texto}
              </p>
            )}

            {/* Acciones globales */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {ESTADOS_APROBABLES.includes(prestamoDetalle.estado_prestamo) &&
                prestamoDetalle.detalles?.some(d => d.estado_prestamo_ejemplar === 'solicitado') && (
                <button
                  onClick={handleAprobarTodos}
                  disabled={loadingAccion}
                  style={{ padding: '0.5rem 1rem', borderRadius: 8, border: 'none', background: '#93c5fd', color: '#0c1a2e', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Aprobar todos
                </button>
              )}
              {ESTADOS_ACTIVABLES.includes(prestamoDetalle.estado_prestamo) && (
                <button
                  onClick={handleActivar}
                  disabled={loadingAccion}
                  style={{ padding: '0.5rem 1rem', borderRadius: 8, border: 'none', background: '#7de3b8', color: '#0c1a2e', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Activar préstamo
                </button>
              )}
              {ESTADOS_CANCELABLES.includes(prestamoDetalle.estado_prestamo) && (
                <button
                  onClick={handleCancelar}
                  disabled={loadingAccion}
                  style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid rgba(240,149,149,0.4)', background: 'rgba(240,149,149,0.1)', color: '#f09595', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Cancelar préstamo
                </button>
              )}
            </div>

            {/* Ejemplares */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Ejemplares
              </span>
              {prestamoDetalle.detalles?.map(det => (
                <div
                  key={det.id_ejemplar}
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{det.titulo}</span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                      {det.autor} · Ejemplar #{det.id_ejemplar}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 9px',
                      borderRadius: 999,
                      background: 'rgba(255,255,255,0.07)',
                      color: ESTADO_COLORS[det.estado_prestamo_ejemplar] || '#fff'
                    }}>
                      {det.estado_prestamo_ejemplar}
                    </span>
                    {ESTADOS_APROBABLES.includes(prestamoDetalle.estado_prestamo) &&
                      det.estado_prestamo_ejemplar === 'solicitado' && (
                        <>
                          <button
                            onClick={() => handleResponder(det.id_ejemplar, 'aprobado')}
                            disabled={loadingAccion}
                            style={{ padding: '0.3rem 0.7rem', borderRadius: 6, border: 'none', background: '#7de3b8', color: '#0c1a2e', fontWeight: 700, cursor: 'pointer', fontSize: '0.78rem' }}
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleResponder(det.id_ejemplar, 'rechazado')}
                            disabled={loadingAccion}
                            style={{ padding: '0.3rem 0.7rem', borderRadius: 6, border: 'none', background: '#f09595', color: '#0c1a2e', fontWeight: 700, cursor: 'pointer', fontSize: '0.78rem' }}
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default GestionPrestamosPage