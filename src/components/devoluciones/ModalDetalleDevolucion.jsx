import { useState, useEffect } from 'react'
import { getDetalleDevoluciones } from '../../services/returns.services'
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
  bueno: { bg: 'rgba(29,158,117,0.2)', color: '#7de3b8', label: 'Buen estado' },
  deteriorado: { bg: 'rgba(245,158,11,0.2)', color: '#fcd34d', label: 'Deteriorado' },
  danado: { bg: 'rgba(239,68,68,0.2)', color: '#f09595', label: 'Dañado' }
}

const ModalDetalleDevolucion = ({ prestamo, onCerrar }) => {
  const [detalle, setDetalle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getDetalleDevoluciones(prestamo.id_prestamo)
        setDetalle(data)
      } catch {
        setError('Error al cargar el detalle')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [prestamo.id_prestamo])

  return (
    <div className="modal-dev-overlay" onClick={onCerrar}>
      <div className="modal-dev-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 620 }}>

        <div className="modal-dev__header">
          <div>
            <h2 className="modal-dev__title">Detalle de devolución</h2>
            <p className="modal-dev__subtitle">
              Préstamo #{prestamo.id_prestamo} · {prestamo.nombre_apellido}
            </p>
          </div>
          
        </div>

        {loading && <p className="modal-dev__loading">Cargando detalle...</p>}
        {error && <p className="modal-dev__error" style={{ margin: '1rem 1.5rem' }}>{error}</p>}

        {detalle && !loading && (
          <div className="modal-dev__ejemplares" style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>

            {/* Devueltos */}
            {detalle.devueltos.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Ejemplares devueltos ({detalle.devueltos.length})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {detalle.devueltos.map(dev => {
                    const est = ESTADO_COLORS[dev.estado_devuelto] || ESTADO_COLORS.bueno
                    return (
                      <div
                        key={dev.id_devolucion}
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: 10,
                          padding: '0.875rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', display: 'block' }}>
                              {dev.titulo}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                              {dev.autor} · Ejemplar #{dev.id_ejemplar}
                            </span>
                          </div>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '3px 9px',
                            borderRadius: 999,
                            background: est.bg,
                            color: est.color,
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                          }}>
                            {est.label}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
                          <span>📅 {formatFecha(dev.fecha_devolucion)}</span>
                          <span>👤 {dev.bibliotecario}</span>
                        </div>

                        {dev.observaciones && (
                          <span style={{
                            fontSize: '0.78rem',
                            color: '#fcd34d',
                            background: 'rgba(245,158,11,0.08)',
                            padding: '4px 8px',
                            borderRadius: 6,
                            display: 'inline-block'
                          }}>
                            ⚠ {dev.observaciones}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Pendientes */}
            {detalle.pendientes.length > 0 && (
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(240,149,149,0.8)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Pendientes de devolución ({detalle.pendientes.length})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                  {detalle.pendientes.map(pend => (
                    <div
                      key={pend.id_ejemplar}
                      style={{
                        background: 'rgba(240,149,149,0.05)',
                        border: '1px solid rgba(240,149,149,0.15)',
                        borderRadius: 10,
                        padding: '0.75rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', display: 'block' }}>
                          {pend.titulo}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                          {pend.autor} · Ejemplar #{pend.id_ejemplar}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#f09595', fontWeight: 700 }}>
                        No devuelto
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detalle.devueltos.length === 0 && detalle.pendientes.length === 0 && (
              <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '1rem' }}>
                Sin registros de devolución
              </p>
            )}
          </div>
        )}

        <div className="modal-dev__footer">
          <button className="modal-dev__btn-cancelar" onClick={onCerrar}>Cerrar</button>
        </div>
      </div>
    </div>
  )
}

export default ModalDetalleDevolucion