import './SancionesComponents.css'

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const partes = fecha.split('T')[0].split('-')
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

const TIPO_LABELS = {
  falta_entrega: 'Falta de entrega',
  devolucion_tardia: 'Devolución tardía',
  deterioro: 'Deterioro',
  perdida: 'Pérdida',
  comportamiento: 'Comportamiento'
}

const TIPO_COLORS = {
  falta_entrega: 'badge--rojo',
  devolucion_tardia: 'badge--amarillo',
  deterioro: 'badge--naranja',
  perdida: 'badge--rojo',
  comportamiento: 'badge--purpura'
}

const SancionGrupoCard = ({ grupo, onVerDetalle }) => {
  return (
    <div className={`sancion-card ${grupo.tiene_escaladas ? 'sancion-card--escalada' : 'sancion-card--activa'}`}>
      <div className="sancion-card__header">
        <div className="sancion-card__badges">
          {grupo.tipos?.map(tipo => (
            <span key={tipo} className={`sancion-badge ${TIPO_COLORS[tipo]}`}>
              {TIPO_LABELS[tipo]}
            </span>
          ))}
          {grupo.tiene_escaladas && (
            <span className="sancion-badge badge--gris">Escalada</span>
          )}
        </div>
        <span className="sancion-card__id">Préstamo #{grupo.id_prestamo}</span>
      </div>

      <div className="sancion-card__usuario">
        <span className="sancion-card__nombre">{grupo.usuario_nombre}</span>
        <span className="sancion-card__detalle">
          {grupo.usuario_correo} · CI: {grupo.usuario_ci}
        </span>
      </div>

      <div className="sancion-card__info">
        <div className="sancion-card__item">
          <span className="sancion-card__label">Sanciones</span>
          <span className="sancion-card__value">{grupo.total_sanciones}</span>
        </div>
        <div className="sancion-card__item">
          <span className="sancion-card__label">Primera sanción</span>
          <span className="sancion-card__value">{formatFecha(grupo.fecha_primera_sancion)}</span>
        </div>
        {grupo.fecha_tope_devolucion && (
          <div className="sancion-card__item">
            <span className="sancion-card__label">Fecha tope préstamo</span>
            <span className="sancion-card__value text-rojo">
              {formatFecha(grupo.fecha_tope_devolucion)}
            </span>
          </div>
        )}
        {grupo.fecha_limite_maxima && (
          <div className="sancion-card__item">
            <span className="sancion-card__label">Fecha límite</span>
            <span className="sancion-card__value">{formatFecha(grupo.fecha_limite_maxima)}</span>
          </div>
        )}
        {grupo.admin_nombre && (
          <div className="sancion-card__item">
            <span className="sancion-card__label">Registrado por</span>
            <span className="sancion-card__value">{grupo.admin_nombre}</span>
          </div>
        )}
      </div>

      <div className="sancion-card__acciones">
        <button
          className="sancion-btn sancion-btn--ghost"
          onClick={() => onVerDetalle(grupo)}
        >
          Ver detalle y gestionar
        </button>
      </div>
    </div>
  )
}

export default SancionGrupoCard