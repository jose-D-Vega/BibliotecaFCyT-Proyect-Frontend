import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  getAllSancionesComportamientoByUsuario,
  resolveSanction
} from '../../../services/sanctions.services'
import ModalConfirmacionAccion from '../../../components/sanciones/ModalConfirmacionAccion'
import './AdminSancionesPage.css'
import '../../../components/sanciones/SancionesComponents.css'

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const partes = fecha.split('T')[0].split('-')
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

const ESTADO_COLORS = {
  activa:    { bg: 'rgba(239,68,68,0.15)',      color: '#f09595',               label: 'Activa'    },
  escalada:  { bg: 'rgba(234,179,8,0.15)',       color: '#fcd34d',               label: 'Escalada'  },
  resuelta:  { bg: 'rgba(29,158,117,0.15)',      color: '#7de3b8',               label: 'Resuelta'  },
  rechazada: { bg: 'rgba(255,255,255,0.05)',     color: 'rgba(255,255,255,0.3)', label: 'Rechazada' },
}

const DetalleSancionesComportamientoPage = () => {
  const { id_usuario } = useParams()
  const navigate       = useNavigate()
  const location       = useLocation()
  const tabOrigen = location.state?.tabActiva || 'resuelta,rechazada'
  const esAdmin = window.location.pathname.startsWith('/admin')

  const [sanciones,     setSanciones]     = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [loadingAccion, setLoadingAccion] = useState(false)
  const [mensaje,       setMensaje]       = useState(null)
  const [modalConfirm,  setModalConfirm]  = useState(null)

  const fetchSanciones = async () => {
    try {
      setLoading(true)
      const data = await getAllSancionesComportamientoByUsuario(id_usuario)
      setSanciones(data)
    } catch {
      setError('Error al cargar las sanciones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSanciones() }, [id_usuario])

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto })
    setTimeout(() => setMensaje(null), 3000)
  }

  const infoUsuario = sanciones[0]

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
        } catch (err) {
          mostrarMensaje('error', err.response?.data?.error || 'Error al resolver')
          setModalConfirm(null)
        } finally {
          setLoadingAccion(false)
        }
      }
    })
  }

  return (
    <div className="sanciones-page">

      <div className="sanciones-page__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            className="modal-dev__btn-cancelar"
            style={{ padding: '0.5rem 1rem' }}
            onClick={() => navigate(
              esAdmin ? '/admin/sanciones' : '/bibliotecario/sanciones',
              { state: { tabActiva: tabOrigen } }
            )}
          >
            ← Volver
          </button>
          <div>
            <h1 className="sanciones-page__title">Sanciones por comportamiento</h1>
            {infoUsuario && (
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
                {infoUsuario.usuario_nombre} · {infoUsuario.usuario_correo} · CI: {infoUsuario.usuario_ci}
              </p>
            )}
          </div>
        </div>
      </div>

      {mensaje && (
        <p className={`sanciones-mensaje sanciones-mensaje--${mensaje.tipo}`}>{mensaje.texto}</p>
      )}

      {loading && <p className="sanciones-loading">Cargando...</p>}
      {error   && <p className="sanciones-error">{error}</p>}

      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '720px', margin: 'auto' }}>
          {sanciones.length === 0 && (
            <p className="sanciones-vacio">No hay sanciones registradas para este usuario.</p>
          )}
          {sanciones.map(s => {
            const est = ESTADO_COLORS[s.estado_sancion] || ESTADO_COLORS.activa
            return (
              <div key={s.id_sancion} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                    Sanción #{s.id_sancion}
                  </span>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 700,
                    padding: '4px 12px', borderRadius: 999,
                    background: est.bg, color: est.color, flexShrink: 0
                  }}>
                    {est.label}
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', margin: 0, fontStyle: 'italic' }}>
                  {s.descripcion_sancion}
                </p>

                <div className="modal-sancion__grid">
                  <div className="sancion-card__item">
                    <span className="sancion-card__label">Fecha sanción</span>
                    <span className="sancion-card__value">{formatFecha(s.fecha_sancion)}</span>
                  </div>
                  {s.dias_suspension != null ? (
                    <div className="sancion-card__item">
                      <span className="sancion-card__label">Suspensión</span>
                      <span className="sancion-card__value">{s.dias_suspension} días</span>
                    </div>
                  ) : (
                    <div className="sancion-card__item">
                      <span className="sancion-card__label">Suspensión</span>
                      <span className="sancion-card__value" style={{ color: '#f09595' }}>Indefinida</span>
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
  )
}

export default DetalleSancionesComportamientoPage