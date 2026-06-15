import './SancionesComponents.css'

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const partes = fecha.split('T')[0].split('-')
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

const TIPO_LABELS = {
  devolucion_tardia: 'Devolución tardía',
  deterioro: 'Deterioro de material',
  perdida: 'Pérdida de material',
  comportamiento: 'Comportamiento inadecuado'
}

const TIPO_COLORS = {
  devolucion_tardia: 'badge--amarillo',
  deterioro: 'badge--naranja',
  perdida: 'badge--rojo',
  comportamiento: 'badge--purpura'
}

const ESTADO_COLORS = {
  activa: 'badge--rojo',
  resuelta: 'badge--verde',
  escalada: 'badge--gris'
}

const ESTADO_LABELS = {
  activa: 'Activa',
  resuelta: 'Resuelta',
  escalada: 'Escalada'
}

const SancionCard = ({ sancion, onResolver, onEscalar, onVerDetalle }) => {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const fechaLimite = sancion.fecha_limite ? new Date(sancion.fecha_limite) : null
  const diasRestantes = fechaLimite
    ? Math.ceil((fechaLimite - hoy) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className={`sancion-card sancion-card--${sancion.estado_sancion}`}>
      <div className="sancion-card__header">
        <div className="sancion-card__badges">
          <span className={`sancion-badge ${TIPO_COLORS[sancion.tipo_infraccion]}`}>
            {TIPO_LABELS[sancion.tipo_infraccion]}
          </span>
          <span className={`sancion-badge ${ESTADO_COLORS[sancion.estado_sancion]}`}>
            {ESTADO_LABELS[sancion.estado_sancion]}
          </span>
        </div>
        <span className="sancion-card__id">#{sancion.id_sancion}</span>
      </div>

      <div className="sancion-card__usuario">
        <span className="sancion-card__nombre">{sancion.usuario_nombre}</span>
        <span className="sancion-card__detalle">
          {sancion.usuario_correo} · CI: {sancion.usuario_ci}
        </span>
      </div>

      <div className="sancion-card__libro">
        <span className="sancion-card__libro-titulo">{sancion.libro_titulo}</span>
        <span className="sancion-card__detalle">
          {sancion.libro_autor} · Ejemplar #{sancion.id_ejemplar}
        </span>
      </div>

      <p className="sancion-card__desc">{sancion.descripcion_sancion}</p>

      <div className="sancion-card__info">
        <div className="sancion-card__item">
          <span className="sancion-card__label">Fecha sanción</span>
          <span className="sancion-card__value">{formatFecha(sancion.fecha_sancion)}</span>
        </div>
        {sancion.fecha_limite && (
          <div className="sancion-card__item">
            <span className="sancion-card__label">Fecha límite</span>
            <span className={`sancion-card__value ${diasRestantes !== null && diasRestantes <= 0 ? 'text-rojo' : diasRestantes !== null && diasRestantes <= 7 ? 'text-amarillo' : ''}`}>
              {formatFecha(sancion.fecha_limite)}
              {diasRestantes !== null && sancion.estado_sancion === 'activa' && (
                <span style={{ fontSize: '0.72rem', marginLeft: 4 }}>
                  {diasRestantes <= 0 ? '(vencida)' : `(${diasRestantes}d restantes)`}
                </span>
              )}
            </span>
          </div>
        )}
        {sancion.dias_suspension && (
          <div className="sancion-card__item">
            <span className="sancion-card__label">Suspensión</span>
            <span className="sancion-card__value">{sancion.dias_suspension} días</span>
          </div>
        )}
        {sancion.fecha_fin_suspension && (
          <div className="sancion-card__item">
            <span className="sancion-card__label">Fin suspensión</span>
            <span className="sancion-card__value">{formatFecha(sancion.fecha_fin_suspension)}</span>
          </div>
        )}
        <div className="sancion-card__item">
          <span className="sancion-card__label">Registrado por</span>
          <span className="sancion-card__value">{sancion.admin_nombre || '—'}</span>
        </div>
      </div>

      <div className="sancion-card__acciones">
        <button className="sancion-btn sancion-btn--ghost" onClick={() => onVerDetalle(sancion)}>
          Ver detalle
        </button>
        {sancion.estado_sancion === 'activa' && (
          <>
            <button className="sancion-btn sancion-btn--resolver" onClick={() => onResolver(sancion)}>
              Resolver
            </button>
            <button className="sancion-btn sancion-btn--escalar" onClick={() => onEscalar(sancion)}>
              Escalar
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default SancionCard