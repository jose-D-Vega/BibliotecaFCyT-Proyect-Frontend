import { useState, useEffect } from 'react'
import { getDetalleDevoluciones, recuperarEjemplarPerdido, reemplazarEjemplarPerdido } from '../../services/returns.services'
import ModalConfirmacionAccion from '../sanciones/ModalConfirmacionAccion'
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
  bueno:       { bg: 'rgba(29,158,117,0.2)',  color: '#7de3b8', label: 'Buen estado' },
  deteriorado: { bg: 'rgba(245,158,11,0.2)',  color: '#fcd34d', label: 'Deteriorado' },
  danado:      { bg: 'rgba(239,68,68,0.2)',   color: '#f09595', label: 'Dañado'      },
  reemplazado: { bg: 'rgba(99,102,241,0.2)',  color: '#a5b4fc', label: 'Reemplazado' },
}

const ModalDetalleDevolucion = ({ prestamo, onCerrar, onActualizar }) => {
  const [detalle,       setDetalle]       = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [loadingAccion, setLoadingAccion] = useState(false)
  const [mensaje,       setMensaje]       = useState(null)
  const [modalConfirm,  setModalConfirm]  = useState(null)

  // Para el modal de recuperación — estado del ejemplar al devolver
  const [ejemplarRecuperando, setEjemplarRecuperando] = useState(null)
  const [estadoDevuelto,      setEstadoDevuelto]      = useState('bueno')
  const [observaciones,       setObservaciones]       = useState('')

  const fetchDetalle = async () => {
    try {
      setLoading(true)
      const data = await getDetalleDevoluciones(prestamo.id_prestamo)
      setDetalle(data)
    } catch {
      setError('Error al cargar el detalle')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDetalle() }, [prestamo.id_prestamo])

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto })
    setTimeout(() => setMensaje(null), 4000)
  }

  const handleRecuperar = (ejemplar) => {
    setEjemplarRecuperando(ejemplar)
    setEstadoDevuelto('bueno')
    setObservaciones('')
  }

  const confirmarRecuperacion = async () => {
    try {
      setLoadingAccion(true)
      await recuperarEjemplarPerdido(prestamo.id_prestamo, ejemplarRecuperando.id_ejemplar, {
        estado_devuelto: estadoDevuelto,
        observaciones: observaciones || null
      })
      setEjemplarRecuperando(null)
      mostrarMensaje('ok', 'Ejemplar recuperado registrado correctamente')
      fetchDetalle()
      onActualizar?.()
    } catch (err) {
      mostrarMensaje('error', err.response?.data?.error || 'Error al registrar recuperación')
      setEjemplarRecuperando(null)
    } finally {
      setLoadingAccion(false)
    }
  }

  const handleReemplazar = (ejemplar) => {
    setModalConfirm({
      titulo: 'Registrar reemplazo',
      mensaje: `¿El usuario entregó un ejemplar de reemplazo para "${ejemplar.titulo}" (Ejemplar #${ejemplar.id_ejemplar})? Se sumará una unidad al inventario del libro y la sanción por pérdida se resolverá automáticamente.`,
      labelConfirmar: 'Confirmar reemplazo',
      variante: 'resolver',
      onConfirmar: async () => {
        try {
          setLoadingAccion(true)
          await reemplazarEjemplarPerdido(prestamo.id_prestamo, ejemplar.id_ejemplar)
          setModalConfirm(null)
          mostrarMensaje('ok', 'Reemplazo registrado correctamente')
          fetchDetalle()
          onActualizar?.()
        } catch (err) {
          mostrarMensaje('error', err.response?.data?.error || 'Error al registrar reemplazo')
          setModalConfirm(null)
        } finally {
          setLoadingAccion(false)
        }
      }
    })
  }

  return (
    <div className="modal-dev-overlay" onClick={onCerrar}>
      <div className="modal-dev-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 680 }}>

        <div className="modal-dev__header">
          <div>
            <h2 className="modal-dev__title">Detalle de devolución</h2>
            <p className="modal-dev__subtitle">
              Préstamo #{prestamo.id_prestamo_original ?? prestamo.id_prestamo}
              {prestamo.numero_renovacion > 0 && ` · Renovación #${prestamo.numero_renovacion}`}
              {' · '}{prestamo.nombre_apellido}
            </p>
          </div>
        </div>

        {mensaje && (
          <div style={{ padding: '0 1.5rem 0.5rem' }}>
            <p className={`sanciones-mensaje sanciones-mensaje--${mensaje.tipo}`} style={{ margin: 0 }}>
              {mensaje.texto}
            </p>
          </div>
        )}

        {loading && (
          <div className="tab-loading">
            <div className="tab-spinner"></div>
            <p>Cargando detalle...</p>
          </div>
        )}
        {error   && <p className="modal-dev__error" style={{ margin: '1rem 1.5rem' }}>{error}</p>}

        {detalle && !loading && (
          <div className="modal-dev__ejemplares" style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>

            {/* ── Devueltos ── */}
            {detalle.devueltos.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Ejemplares devueltos ({detalle.devueltos.length})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {detalle.devueltos.map(dev => {
                    const est = ESTADO_COLORS[dev.estado_devuelto] || ESTADO_COLORS.bueno
                    return (
                      <div key={dev.id_devolucion} style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 10, padding: '0.875rem',
                        display: 'flex', flexDirection: 'column', gap: 6
                      }}>
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
                            fontSize: '0.72rem', fontWeight: 700,
                            padding: '3px 9px', borderRadius: 999,
                            background: est.bg, color: est.color,
                            whiteSpace: 'nowrap', flexShrink: 0
                          }}>
                            {est.label}
                          </span>
                        </div>
                        
                        <p style={{
                          fontSize: '0.78rem',
                          color: 'rgba(255,255,255,0.45)',
                          margin: 0,
                          lineHeight: 1.5,
                          wordBreak: 'break-word'
                        }}>
                          Registrado el{' '}
                          <span style={{ color: 'rgba(255,255,255,0.65)' }}>
                            {formatFecha(dev.fecha_devolucion)} 📅
                          </span>
                          <br /> por{' '}
                          <span style={{ color: 'rgba(255,255,255,0.65)' }}>
                            {dev.bibliotecario} 👤
                          </span>
                        </p>
                        {dev.observaciones && (
                          <span style={{
                            fontSize: '0.78rem', color: '#fcd34d',
                            background: 'rgba(245,158,11,0.08)',
                            padding: '4px 8px', borderRadius: 6, display: 'inline-block'
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

            {/* ── Perdidos — con acciones ── */}
            {detalle.perdidos?.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(239,68,68,0.8)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Ejemplares perdidos ({detalle.perdidos.length})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {detalle.perdidos.map(perd => (
                    <div key={perd.id_ejemplar} style={{
                      background: 'rgba(239,68,68,0.05)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      borderRadius: 10, padding: '0.875rem',
                      display: 'flex', flexDirection: 'column', gap: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', display: 'block' }}>
                            {perd.titulo}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                            {perd.autor} · Ejemplar #{perd.id_ejemplar}
                          </span>
                        </div>
                        <span style={{
                          fontSize: '0.72rem', fontWeight: 700,
                          padding: '3px 9px', borderRadius: 999,
                          background: 'rgba(239,68,68,0.15)', color: '#f09595',
                          whiteSpace: 'nowrap', flexShrink: 0
                        }}>
                          Perdido
                        </span>
                      </div>

                      {perd.estado_sancion_perdida && (
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                          Sanción #{perd.id_sancion} · Estado: {perd.estado_sancion_perdida}
                        </span>
                      )}

                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          className="sancion-btn sancion-btn--resolver"
                          onClick={() => handleRecuperar(perd)}
                          disabled={loadingAccion}
                          style={{ fontSize: '0.78rem' }}
                        >
                          📦 Registrar devolución
                        </button>
                        <button
                          className="sancion-btn sancion-btn--primario"
                          onClick={() => handleReemplazar(perd)}
                          disabled={loadingAccion}
                          style={{ fontSize: '0.78rem' }}
                        >
                          🔄 Registrar reemplazo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Pendientes activos ── */}
            {detalle.pendientes.length > 0 && (
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(240,149,149,0.8)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Pendientes de devolución ({detalle.pendientes.length})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                  {detalle.pendientes.map(pend => (
                    <div key={pend.id_ejemplar} style={{
                      background: 'rgba(240,149,149,0.05)',
                      border: '1px solid rgba(240,149,149,0.15)',
                      borderRadius: 10, padding: '0.75rem',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
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

            {detalle.devueltos.length === 0 && detalle.pendientes.length === 0 && !detalle.perdidos?.length && (
              <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '1rem' }}>
                Sin registros de devolución
              </p>
            )}
          </div>
        )}

        <div className="modal-dev__footer">
          <button className="modal-dev__btn-cancelar" onClick={onCerrar}>Cerrar</button>
        </div>

        {/* Modal de recuperación — con selector de estado */}
        {ejemplarRecuperando && (
          <div className="modal-dev-overlay" onClick={() => setEjemplarRecuperando(null)}>
            <div className="modal-dev-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
              <div className="modal-dev__header">
                <div>
                  <h2 className="modal-dev__title">Registrar devolución</h2>
                  <p className="modal-dev__subtitle">
                    {ejemplarRecuperando.titulo} · Ejemplar #{ejemplarRecuperando.id_ejemplar}
                  </p>
                </div>
                <button className="modal-dev__cerrar" onClick={() => setEjemplarRecuperando(null)}>✕</button>
              </div>

              <div className="modal-sancion__body" style={{ gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
                    Estado en que fue devuelto
                  </label>
                  <select
                    className="modal-dev__select"
                    value={estadoDevuelto}
                    onChange={e => setEstadoDevuelto(e.target.value)}
                  >
                    <option value="bueno">Buen estado</option>
                    <option value="deteriorado">Deteriorado</option>
                    <option value="danado">Dañado (no reutilizable)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
                    Observaciones <span style={{ color: 'rgba(255,255,255,0.3)' }}>(opcional)</span>
                  </label>
                  <textarea
                    className="nueva-sancion-input"
                    style={{ resize: 'vertical', minHeight: 80, fontFamily: 'inherit' }}
                    value={observaciones}
                    onChange={e => setObservaciones(e.target.value)}
                    placeholder="Descripción del estado del material..."
                  />
                </div>

                {estadoDevuelto === 'danado' && (
                  <p style={{ fontSize: '0.8rem', color: '#fcd34d', margin: 0,
                    background: 'rgba(245,158,11,0.08)', padding: '8px 12px', borderRadius: 8 }}>
                    ⚠ Un ejemplar dañado no se suma al inventario. Si corresponde, registrá además una sanción por deterioro.
                  </p>
                )}
              </div>

              <div className="modal-dev__footer">
                <button className="modal-dev__btn-cancelar" onClick={() => setEjemplarRecuperando(null)} disabled={loadingAccion}>
                  Cancelar
                </button>
                <button className="sancion-btn sancion-btn--resolver" onClick={confirmarRecuperacion} disabled={loadingAccion}>
                  {loadingAccion ? 'Registrando...' : 'Confirmar devolución'}
                </button>
              </div>
            </div>
          </div>
        )}

        {modalConfirm && (
          <ModalConfirmacionAccion
            titulo={modalConfirm.titulo}
            mensaje={modalConfirm.mensaje}
            labelConfirmar={modalConfirm.labelConfirmar}
            variante={modalConfirm.variante}
            loading={loadingAccion}
            onConfirmar={modalConfirm.onConfirmar}
            onCancelar={() => setModalConfirm(null)}
          />
        )}
      </div>
    </div>
  )
}

export default ModalDetalleDevolucion