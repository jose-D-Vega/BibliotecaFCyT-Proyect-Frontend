import './SancionesComponents.css'

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const partes = fecha.split('T')[0].split('-')
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

const SancionComportamientoCard = ({ grupo, onVerDetalle }) => {
  return (
    <div className={`sancion-card ${grupo.tiene_escaladas ? 'sancion-card--escalada' : 'sancion-card--activa'}`}>
      <div className="sancion-card__header">
        <div className="sancion-card__badges">
          <span className="sancion-badge badge--purpura">Comportamiento inadecuado</span>
          {grupo.tiene_escaladas && (
            <span className="sancion-badge badge--gris">Escalada</span>
          )}
        </div>
        <span className="sancion-card__id">{grupo.total_sanciones} sanción{grupo.total_sanciones > 1 ? 'es' : ''}</span>
      </div>

      <div className="sancion-card__usuario">
        <span className="sancion-card__nombre">{grupo.usuario_nombre}</span>
        <span className="sancion-card__detalle">
          {grupo.usuario_correo} · CI: {grupo.usuario_ci}
        </span>
      </div>

      <div className="sancion-card__info">
        <div className="sancion-card__item">
          <span className="sancion-card__label">Primera sanción</span>
          <span className="sancion-card__value">{formatFecha(grupo.fecha_primera_sancion)}</span>
        </div>
        <div className="sancion-card__item">
          <span className="sancion-card__label">Última sanción</span>
          <span className="sancion-card__value">{formatFecha(grupo.fecha_ultima_sancion)}</span>
        </div>
        {grupo.fecha_fin_suspension_maxima && (
          <div className="sancion-card__item">
            <span className="sancion-card__label">Fin de suspensión</span>
            <span className="sancion-card__value text-amarillo">
              {formatFecha(grupo.fecha_fin_suspension_maxima)}
            </span>
          </div>
        )}
        {grupo.tiene_suspension_indefinida && (
          <div className="sancion-card__item">
            <span className="sancion-card__label">Suspensión</span>
            <span className="sancion-card__value text-rojo">Indefinida</span>
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

export default SancionComportamientoCard