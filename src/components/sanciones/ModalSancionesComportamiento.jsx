import { useState, useEffect } from 'react'
import { getSancionesComportamientoByUsuario, resolveSanction } from '../../services/sanctions.services'
import ModalConfirmacionAccion from './ModalConfirmacionAccion'
import { editSanction } from '../../services/sanctions.services'
import ModalEditarDescripcion from './ModalEditarDescripcion'
import ModalEditarSuspension from './ModalEditarSuspension'
import './SancionesComponents.css'

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const partes = fecha.split('T')[0].split('-')
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

const ESTADO_COLORS = {
  activa:    { bg: 'rgba(239,68,68,0.15)',      color: '#f09595',               label: 'Activa'    },
  escalada:  { bg: 'rgba(234,179,8,0.15)',       color: '#fcd34d',               label: 'Escalada'  },
  resuelta:  { bg: 'rgba(29,158,117,0.15)',      color: '#7de3b8',               label: 'Resuelta'  },
  rechazada: { bg: 'rgba(255,255,255,0.05)',     color: 'rgba(255,255,255,0.3)', label: 'Rechazada' }
}

const ModalSancionesComportamiento = ({ grupo, onCerrar, onActualizar }) => {
  const [sanciones,     setSanciones]     = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [loadingAccion, setLoadingAccion] = useState(false)
  const [mensaje,       setMensaje]       = useState(null)
  const [modalConfirm,  setModalConfirm]  = useState(null)

  const [editandoDescripcion, setEditandoDescripcion] = useState(null)
  const [editandoSuspension,  setEditandoSuspension]  = useState(null)
  const [loadingEdicion,      setLoadingEdicion]      = useState(false)

  const fetchSanciones = async () => {
    try {
      setLoading(true)
      const data = await getSancionesComportamientoByUsuario(grupo.id_usuario, grupo.tabActiva)
      setSanciones(data)
    } catch {
      setError('Error al cargar las sanciones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSanciones() }, [grupo.id_usuario])

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto })
    setTimeout(() => setMensaje(null), 3000)
  }

  const handleResolver = (id_sancion) => {
    setModalConfirm({
      titulo: 'Resolver sanción',
      mensaje: '¿Marcás como resuelta esta sanción? Si el usuario no tiene otras sanciones activas, recuperará el acceso.',
      labelConfirmar: 'Resolver',
      variante: 'resolver',
      onConfirmar: async () => {
        try {
          setLoadingAccion(true)
          await resolveSanction(id_sancion)
          setModalConfirm(null)
          mostrarMensaje('ok', 'Sanción resuelta')
          fetchSanciones()
          onActualizar?.()
        } catch (err) {
          mostrarMensaje('error', err.response?.data?.error || 'Error al resolver')
          setModalConfirm(null)
        } finally {
          setLoadingAccion(false)
        }
      }
    })
  }

  const handleGuardarDescripcion = async (descripcion) => {
    try {
      setLoadingEdicion(true)
      await editSanction(editandoDescripcion.id_sancion, { descripcion_sancion: descripcion })
      setEditandoDescripcion(null)
      mostrarMensaje('ok', 'Descripción actualizada')
      fetchSanciones()
      onActualizar?.()
    } catch (err) {
      mostrarMensaje('error', err.response?.data?.error || 'Error al guardar')
    } finally {
      setLoadingEdicion(false)
    }
  }

  const handleGuardarSuspension = async (dias) => {
    try {
      setLoadingEdicion(true)
      await editSanction(editandoSuspension.id_sancion, { dias_suspension: dias })
      setEditandoSuspension(null)
      mostrarMensaje('ok', 'Suspensión actualizada')
      fetchSanciones()
      onActualizar?.()
    } catch (err) {
      mostrarMensaje('error', err.response?.data?.error || 'Error al guardar')
    } finally {
      setLoadingEdicion(false)
    }
  }

  return (
    <div className="modal-sancion-overlay" onClick={onCerrar}>
      <div className="modal-sancion-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 680 }}>

        <div className="modal-sancion__header">
          <div>
            <h2 className="modal-sancion__title">Sanciones por comportamiento</h2>
            <p className="modal-sancion__subtitle">
              {grupo.usuario_nombre} · {grupo.usuario_correo} · CI: {grupo.usuario_ci}
            </p>
          </div>
          <button className="modal-dev__cerrar" onClick={onCerrar}>✕</button>
        </div>

        {mensaje && (
          <div style={{ padding: '0 1.5rem 0.5rem', flexShrink: 0 }}>
            <p className={`sanciones-mensaje sanciones-mensaje--${mensaje.tipo}`}>
              {mensaje.texto}
            </p>
          </div>
        )}

        <div className="modal-sancion__body">
          {loading && <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>Cargando...</p>}
          {error   && <p className="sanciones-error">{error}</p>}
          {!loading && !error && sanciones.length === 0 && (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
              No hay sanciones en esta categoría.
            </p>
          )}

          {!loading && sanciones.map(s => {
            const est = ESTADO_COLORS[s.estado_sancion] || ESTADO_COLORS.activa
            return (
              <div key={s.id_sancion} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>
                    Sanción #{s.id_sancion}
                  </span>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 700,
                    padding: '3px 9px', borderRadius: 999,
                    background: est.bg, color: est.color, flexShrink: 0
                  }}>
                    {est.label}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', margin: 0, fontStyle: 'italic', flex: 1 }}>
                    {s.descripcion_sancion || '—'}
                  </p>
                  {s.estado_sancion === 'activa' && (
                    <button
                      title="Editar descripción"
                      onClick={() => setEditandoDescripcion(s)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'rgba(255,255,255,0.35)', padding: '2px 4px', flexShrink: 0,
                        fontSize: '0.9rem', lineHeight: 1, transition: 'color 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                    >
                      ✏️
                    </button>
                  )}
                </div>

                <div className="modal-sancion__grid" style={{ padding: '0.6rem' }}>
                  <div className="sancion-card__item">
                    <span className="sancion-card__label">Fecha sanción</span>
                    <span className="sancion-card__value">{formatFecha(s.fecha_sancion)}</span>
                  </div>
                  <div className="sancion-card__item">
                    <span className="sancion-card__label">Suspensión</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="sancion-card__value">
                        {s.dias_suspension != null ? `${s.dias_suspension} días` : <span style={{ color: '#f09595' }}>Indefinida</span>}
                      </span>
                      {s.estado_sancion === 'activa' && (
                        <button
                          title="Editar suspensión"
                          onClick={() => setEditandoSuspension(s)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'rgba(255,255,255,0.35)', padding: '2px 4px',
                            fontSize: '0.85rem', lineHeight: 1, transition: 'color 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                        >
                          ✏️
                        </button>
                      )}
                    </div>
                  </div>
                  {s.fecha_fin_suspension && (
                    <div className="sancion-card__item">
                      <span className="sancion-card__label">Fin suspensión</span>
                      <span className="sancion-card__value">{formatFecha(s.fecha_fin_suspension)}</span>
                    </div>
                  )}
                  {s.admin_nombre && (
                    <div className="sancion-card__item">
                      <span className="sancion-card__label">Registrado por</span>
                      <span className="sancion-card__value">{s.admin_nombre}</span>
                    </div>
                  )}
                </div>

                {s.estado_sancion === 'activa' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="sancion-btn sancion-btn--resolver"
                      onClick={() => handleResolver(s.id_sancion)}
                      disabled={loadingAccion}
                    >
                      Resolver
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="modal-dev__footer">
          <button className="modal-dev__btn-cancelar" onClick={onCerrar}>Cerrar</button>
        </div>

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

        {editandoDescripcion && (
          <ModalEditarDescripcion
            sancion={editandoDescripcion}
            onGuardar={handleGuardarDescripcion}
            onCancelar={() => setEditandoDescripcion(null)}
            loading={loadingEdicion}
          />
        )}
        {editandoSuspension && (
          <ModalEditarSuspension
            sancion={editandoSuspension}
            onGuardar={handleGuardarSuspension}
            onCancelar={() => setEditandoSuspension(null)}
            loading={loadingEdicion}
          />
        )}
      </div>
    </div>
  )
}

export default ModalSancionesComportamiento