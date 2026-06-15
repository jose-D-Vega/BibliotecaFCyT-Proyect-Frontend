import { useState, useEffect } from 'react'
import { getSanctionsByLoan } from '../../services/sanctions.services'
import { resolveSanction, escalateSanction } from '../../services/sanctions.services'
import './SancionesComponents.css'

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const partes = fecha.split('T')[0].split('-')
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

const TIPO_LABELS = {
  falta_entrega: 'Falta de entrega',
  devolucion_tardia: 'Devolución tardía',
  deterioro: 'Deterioro de material',
  perdida: 'Pérdida de material',
  comportamiento: 'Comportamiento inadecuado'
}

const ESTADO_COLORS = {
  activa: { bg: 'rgba(239,68,68,0.15)', color: '#f09595', label: 'Activa' },
  escalada: { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', label: 'Escalada' },
  resuelta: { bg: 'rgba(29,158,117,0.15)', color: '#7de3b8', label: 'Resuelta' },
  rechazada: { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', label: 'Rechazada' }
}

const ModalSancionesLoan = ({ grupo, onCerrar, onActualizar }) => {
  const [sanciones, setSanciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [loadingAccion, setLoadingAccion] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  const fetchSanciones = async () => {
    try {
      setLoading(true)
      const data = await getSanctionsByLoan(grupo.id_prestamo)
      setSanciones(data)
    } catch {
      setError('Error al cargar las sanciones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSanciones() }, [grupo.id_prestamo])

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto })
    setTimeout(() => setMensaje(null), 3000)
  }

  const handleResolver = async (id_sancion) => {
    if (!window.confirm('¿Resolver esta sanción?')) return
    try {
      setLoadingAccion(true)
      await resolveSanction(id_sancion)
      mostrarMensaje('ok', 'Sanción resuelta')
      fetchSanciones()
      onActualizar?.()
    } catch (err) {
      mostrarMensaje('error', err.response?.data?.error || 'Error al resolver')
    } finally {
      setLoadingAccion(false)
    }
  }

  const handleEscalar = async (id_sancion) => {
    if (!window.confirm('¿Escalar esta sanción a entidades superiores?')) return
    try {
      setLoadingAccion(true)
      await escalateSanction(id_sancion)
      mostrarMensaje('ok', 'Sanción escalada')
      fetchSanciones()
      onActualizar?.()
    } catch (err) {
      mostrarMensaje('error', err.response?.data?.error || 'Error al escalar')
    } finally {
      setLoadingAccion(false)
    }
  }

  return (
    <div className="modal-sancion-overlay" onClick={onCerrar}>
      <div className="modal-sancion-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>

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

        {mensaje && (
          <div style={{ padding: '0.5rem 1.5rem', flexShrink: 0 }}>
            <p className={`sanciones-mensaje sanciones-mensaje--${mensaje.tipo}`}>
              {mensaje.texto}
            </p>
          </div>
        )}

        <div className="modal-sancion__body">
          {loading && <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>Cargando...</p>}
          {error && <p className="sanciones-error">{error}</p>}

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
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: 999,
                    background: est.bg,
                    color: est.color,
                    flexShrink: 0
                  }}>
                    {est.label}
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', margin: 0, fontStyle: 'italic' }}>
                  {s.descripcion_sancion}
                </p>

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
                    <button
                      className="sancion-btn sancion-btn--escalar"
                      onClick={() => handleEscalar(s.id_sancion)}
                      disabled={loadingAccion}
                    >
                      Escalar
                    </button>
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
      </div>
    </div>
  )
}

export default ModalSancionesLoan