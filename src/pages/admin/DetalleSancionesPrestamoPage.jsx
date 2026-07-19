import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  getAllSanctionsByLoan,
  resolveSanction, escalateSanction, desescalateSanction
} from '../../services/sanctions.services'
import ModalConfirmacionAccion from '../../components/sanciones/ModalConfirmacionAccion'
import './styles/SancionesAdminPage.css'
import '../../components/sanciones/SancionesComponents.css'

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const partes = fecha.split('T')[0].split('-')
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

const TIPO_LABELS = {
  falta_entrega:     'Falta de entrega',
  devolucion_tardia: 'Devolución tardía',
  deterioro:         'Deterioro de material',
  perdida:           'Pérdida de material',
}

const TIPO_ORDER = ['falta_entrega', 'devolucion_tardia', 'deterioro', 'perdida']

const ESTADO_COLORS = {
  activa:    { bg: 'rgba(239,68,68,0.15)',      color: '#f09595',               label: 'Activa'    },
  escalada:  { bg: 'rgba(234,179,8,0.15)',       color: '#fcd34d',               label: 'Escalada'  },
  resuelta:  { bg: 'rgba(29,158,117,0.15)',      color: '#7de3b8',               label: 'Resuelta'  },
  rechazada: { bg: 'rgba(255,255,255,0.05)',     color: 'rgba(255,255,255,0.3)', label: 'Rechazada' },
  pendiente_confirmacion: { bg: 'rgba(99,102,241,0.15)', color: '#a5b4fc', label: 'Pendiente' },
}

const DetalleSancionesPrestamoPage = () => {
  const { id_prestamo } = useParams()
  const navigate        = useNavigate()
  const location        = useLocation()
  const tabOrigen = location.state?.tabActiva || 'resuelta,rechazada'
  const esAdmin = window.location.pathname.startsWith('/admin')

  const [sanciones,     setSanciones]     = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [loadingAccion, setLoadingAccion] = useState(false)
  const [mensaje,       setMensaje]       = useState(null)
  const [modalConfirm,  setModalConfirm]  = useState(null)
  const [orden,         setOrden]         = useState('fecha_asc')

  const fetchSanciones = async () => {
    try {
      setLoading(true)
      const data = await getAllSanctionsByLoan(id_prestamo)
      setSanciones(data)
    } catch {
      setError('Error al cargar las sanciones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSanciones() }, [id_prestamo])

  const sancionesOrdenadas = [...sanciones].sort((a, b) => {
    if (orden === 'tipo') return TIPO_ORDER.indexOf(a.tipo_infraccion) - TIPO_ORDER.indexOf(b.tipo_infraccion)
    const da = new Date(a.fecha_sancion), db = new Date(b.fecha_sancion)
    return orden === 'fecha_asc' ? da - db : db - da
  })

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto })
    setTimeout(() => setMensaje(null), 3000)
  }

  const infoUsuario = sanciones[0]

  const confirmarAccion = (titulo, mensaje, labelConfirmar, variante, accion) => {
    setModalConfirm({ titulo, mensaje, labelConfirmar, variante, onConfirmar: async () => {
      try {
        setLoadingAccion(true)
        await accion()
        setModalConfirm(null)
        fetchSanciones()
      } catch (err) {
        mostrarMensaje('error', err.response?.data?.error || 'Error al procesar')
        setModalConfirm(null)
      } finally {
        setLoadingAccion(false)
      }
    }})
  }

  const handleResolver = (id_sancion) => confirmarAccion(
    'Resolver sanción',
    '¿Marcás como resuelta esta sanción? Si el usuario no tiene otras sanciones activas, recuperará el acceso.',
    'Resolver', 'resolver',
    async () => { await resolveSanction(id_sancion); mostrarMensaje('ok', 'Sanción resuelta') }
  )

  const handleEscalar = (id_sancion) => confirmarAccion(
    'Escalar sanción',
    '¿Escalás esta sanción a entidades superiores?',
    'Escalar', 'escalar',
    async () => { await escalateSanction(id_sancion); mostrarMensaje('ok', 'Sanción escalada') }
  )

  const handleDesescalar = (id_sancion) => confirmarAccion(
    'Des-escalar sanción',
    '¿Revertís esta sanción a estado activa?',
    'Des-escalar', 'desescalar',
    async () => { await desescalateSanction(id_sancion); mostrarMensaje('ok', 'Sanción revertida a activa') }
  )

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
            <h1 className="sanciones-page__title">
              Sanciones — Préstamo #{id_prestamo}
            </h1>
            {infoUsuario && (
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
                {infoUsuario.usuario_nombre} · {infoUsuario.usuario_correo}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Ordenamiento */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center'}}>
        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>Ordenar por:</span>
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
        <p className={`sanciones-mensaje sanciones-mensaje--${mensaje.tipo}`}>{mensaje.texto}</p>
      )}

      {loading && <p className="sanciones-loading">Cargando...</p>}
      {error   && <p className="sanciones-error">{error}</p>}

      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '720px', margin: 'auto' }}>
          {sancionesOrdenadas.map(s => {
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                      {TIPO_LABELS[s.tipo_infraccion]}
                    </span>
                    {s.libro_titulo && (
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>
                        {s.libro_titulo} · {s.libro_autor} · Ejemplar #{s.id_ejemplar}
                      </span>
                    )}
                  </div>
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
                  {s.fecha_limite && (
                    <div className="sancion-card__item">
                      <span className="sancion-card__label">Fecha límite</span>
                      <span className="sancion-card__value">{formatFecha(s.fecha_limite)}</span>
                    </div>
                  )}
                  {s.dias_suspension != null && (
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

export default DetalleSancionesPrestamoPage