import { useState, useEffect } from 'react'
import { getSanctionsByLoan, resolveSanction, escalateSanction, desescalateSanction } from '../../services/sanctions.services'
import ModalConfirmacionAccion from './ModalConfirmacionAccion'
import { editSanction } from '../../services/sanctions.services'
import ModalEditarDescripcion from './ModalEditarDescripcion'
import './SancionesComponents.css'

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const partes = fecha.split('T')[0].split('-')
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

const TIPO_LABELS = {
  falta_entrega:    'Falta de entrega',
  devolucion_tardia: 'Devolución tardía',
  deterioro:        'Deterioro de material',
  perdida:          'Pérdida de material',
  comportamiento:   'Comportamiento inadecuado'
}

const TIPO_ORDER = ['falta_entrega', 'devolucion_tardia', 'deterioro', 'perdida']

const ESTADO_COLORS = {
  activa:    { bg: 'rgba(239,68,68,0.15)',      color: '#f09595',               label: 'Activa'    },
  escalada:  { bg: 'rgba(234,179,8,0.15)',       color: '#fcd34d',               label: 'Escalada'  },
  resuelta:  { bg: 'rgba(29,158,117,0.15)',      color: '#7de3b8',               label: 'Resuelta'  },
  rechazada: { bg: 'rgba(255,255,255,0.05)',     color: 'rgba(255,255,255,0.3)', label: 'Rechazada' }
}

const ModalSancionesLoan = ({ grupo, onCerrar, onActualizar }) => {
  const [sanciones,     setSanciones]     = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [loadingAccion, setLoadingAccion] = useState(false)
  const [mensaje,       setMensaje]       = useState(null)
  const [modalConfirm,  setModalConfirm]  = useState(null)

  const [editandoDescripcion, setEditandoDescripcion] = useState(null) // sancion | null
  const [loadingEdicion,      setLoadingEdicion]      = useState(false)

  // Ordenamiento: 'fecha_asc' | 'fecha_desc' | 'tipo'
  const [orden, setOrden] = useState('fecha_asc')

  const fetchSanciones = async () => {
    try {
      setLoading(true)
      const data = await getSanctionsByLoan(grupo.id_prestamo, grupo.tabActiva)
      setSanciones(data)
    } catch {
      setError('Error al cargar las sanciones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSanciones() }, [grupo.id_prestamo])

  const sancionesOrdenadas = [...sanciones].sort((a, b) => {
    if (orden === 'tipo') {
      return TIPO_ORDER.indexOf(a.tipo_infraccion) - TIPO_ORDER.indexOf(b.tipo_infraccion)
    }
    const da = new Date(a.fecha_sancion)
    const db = new Date(b.fecha_sancion)
    return orden === 'fecha_asc' ? da - db : db - da
  })

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

  const handleEscalar = (id_sancion) => {
    setModalConfirm({
      titulo: 'Escalar sanción',
      mensaje: '¿Escalás esta sanción a entidades superiores?',
      labelConfirmar: 'Escalar',
      variante: 'escalar',
      onConfirmar: async () => {
        try {
          setLoadingAccion(true)
          await escalateSanction(id_sancion)
          setModalConfirm(null)
          mostrarMensaje('ok', 'Sanción escalada')
          fetchSanciones()
          onActualizar?.()
        } catch (err) {
          mostrarMensaje('error', err.response?.data?.error || 'Error al escalar')
          setModalConfirm(null)
        } finally {
          setLoadingAccion(false)
        }
      }
    })
  }

  const handleDesescalar = (id_sancion) => {
    setModalConfirm({
      titulo: 'Des-escalar sanción',
      mensaje: '¿Revertís esta sanción a estado activa? Volverá al flujo normal de gestión.',
      labelConfirmar: 'Des-escalar',
      variante: 'desescalar',
      onConfirmar: async () => {
        try {
          setLoadingAccion(true)
          await desescalateSanction(id_sancion)
          setModalConfirm(null)
          mostrarMensaje('ok', 'Sanción revertida a activa')
          fetchSanciones()
          onActualizar?.()
        } catch (err) {
          mostrarMensaje('error', err.response?.data?.error || 'Error al des-escalar')
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

  return (
    <div className="modal-sancion-overlay" onClick={onCerrar}>
      <div className="modal-sancion-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 780 }}>

        <div className="modal-sancion__header">
          <div>
            <h2 className="modal-sancion__title">
              Sanciones — Préstamo #{grupo.id_prestamo}
            </h2>
            <p className="modal-sancion__subtitle">
              {grupo.usuario_nombre} · {grupo.usuario_correo}
            </p>
          </div>
          <button className="modal-dev__cerrar" onClick={onCerrar}>✕</button>
        </div>

        {/* Controles de ordenamiento */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          flexShrink: 0,
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', alignSelf: 'center', marginRight: 4 }}>
            Ordenar por:
          </span>
          {[
            { id: 'fecha_asc',  label: 'Fecha ↑' },
            { id: 'fecha_desc', label: 'Fecha ↓' },
            { id: 'tipo',       label: 'Tipo' },
          ].map(op => (
            <button
              key={op.id}
              className={`sanciones-subtab-btn ${orden === op.id ? 'activo' : ''}`}
              style={{ padding: '4px 12px', fontSize: '0.78rem' }}
              onClick={() => setOrden(op.id)}
            >
              {op.label}
            </button>
          ))}
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
          {!loading && !error && sancionesOrdenadas.length === 0 && (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
              No hay sanciones en esta categoría.
            </p>
          )}

          {!loading && sancionesOrdenadas.map(s => {
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>
                      {TIPO_LABELS[s.tipo_infraccion]}
                    </span>
                    {s.libro_titulo && (
                      <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
                        {s.libro_titulo} · Ejemplar #{s.id_ejemplar}
                      </span>
                    )}
                  </div>
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
                  {(s.estado_sancion === 'activa' || s.estado_sancion === 'escalada') && (
                    <button
                      title="Editar descripción"
                      onClick={() => setEditandoDescripcion(s)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'rgba(255,255,255,0.35)', padding: '2px 4px', flexShrink: 0,
                        fontSize: '0.9rem', lineHeight: 1,
                        transition: 'color 0.2s'
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
                  {s.fecha_limite && (
                    <div className="sancion-card__item">
                      <span className="sancion-card__label">Fecha límite</span>
                      <span className="sancion-card__value">{formatFecha(s.fecha_limite)}</span>
                    </div>
                  )}
                  {s.dias_suspension && (
                    <div className="sancion-card__item">
                      <span className="sancion-card__label">Suspensión</span>
                      <span className="sancion-card__value">{s.dias_suspension} días</span>
                    </div>
                  )}
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
                    <button className="sancion-btn sancion-btn--escalar" onClick={() => handleEscalar(s.id_sancion)} disabled={loadingAccion}>Escalar</button>
                    <button className="sancion-btn sancion-btn--resolver" onClick={() => handleResolver(s.id_sancion)} disabled={loadingAccion}>Resolver</button>
                  </div>
                )}
                {s.estado_sancion === 'escalada' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="sancion-btn sancion-btn--desescalar" onClick={() => handleDesescalar(s.id_sancion)} disabled={loadingAccion}>Des-escalar</button>
                    <button className="sancion-btn sancion-btn--resolver" onClick={() => handleResolver(s.id_sancion)} disabled={loadingAccion}>Resolver</button>
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
      </div>
    </div>
  )
}

export default ModalSancionesLoan