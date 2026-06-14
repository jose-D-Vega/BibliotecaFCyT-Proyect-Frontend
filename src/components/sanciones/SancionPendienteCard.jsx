import './SancionesComponents.css'

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const partes = fecha.split('T')[0].split('-')
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

const SancionPendienteCard = ({ sancion, onConfirmar, onRechazar, onVerDetalle, disabled }) => {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const fechaTope = sancion.fecha_tope_devolucion
    ? new Date(sancion.fecha_tope_devolucion)
    : null
  const diasVencido = fechaTope
    ? Math.floor((hoy - fechaTope) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="sancion-pendiente-card">
      <div className="sancion-pendiente-card__alert">
        ⚠ Préstamo vencido sin devolución
      </div>

      <div className="sancion-card__usuario">
        <span className="sancion-card__nombre">{sancion.usuario_nombre}</span>
        <span className="sancion-card__detalle">
          {sancion.usuario_correo} · CI: {sancion.usuario_ci}
        </span>
      </div>

      <div className="sancion-card__info">
        <div className="sancion-card__item">
          <span className="sancion-card__label">Préstamo</span>
          <span className="sancion-card__value">#{sancion.id_prestamo}</span>
        </div>
        <div className="sancion-card__item">
          <span className="sancion-card__label">Fecha tope</span>
          <span className="sancion-card__value text-rojo">
            {formatFecha(sancion.fecha_tope_devolucion)}
          </span>
        </div>
        {diasVencido !== null && (
          <div className="sancion-card__item">
            <span className="sancion-card__label">Días vencido</span>
            <span className="sancion-card__value text-rojo">{diasVencido} días</span>
          </div>
        )}
        <div className="sancion-card__item">
          <span className="sancion-card__label">Detectado</span>
          <span className="sancion-card__value">{formatFecha(sancion.fecha_sancion)}</span>
        </div>
      </div>

      <p className="sancion-pendiente-card__desc">
        El usuario está bloqueado preventivamente. Si confirmás la sanción,
        deberá devolver el material para poder usar los servicios nuevamente.
        Si rechazás, se restaura su acceso.
      </p>

      <div className="sancion-card__acciones">
        <button
          className="sancion-btn sancion-btn--ghost"
          onClick={() => onVerDetalle(sancion)}
          disabled={disabled}
        >
          Ver préstamo
        </button>
        <button
          className="sancion-btn sancion-btn--escalar"
          onClick={() => onRechazar(sancion)}
          disabled={disabled}
        >
          Rechazar
        </button>
        <button
          className="sancion-btn sancion-btn--resolver"
          onClick={() => onConfirmar(sancion)}
          disabled={disabled}
        >
          Confirmar sanción
        </button>
      </div>
    </div>
  )
}

export default SancionPendienteCard