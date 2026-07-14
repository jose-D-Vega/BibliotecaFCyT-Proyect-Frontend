import './DevolucionesComponents.css'

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const partes = fecha.split('T')[0].split('-')
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

const PrestamoActivoCard = ({ prestamo, onGestionar }) => {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const fechaTope = new Date(prestamo.fecha_tope_devolucion)
  const vencido = fechaTope < hoy
  const diasRestantes = Math.ceil((fechaTope - hoy) / (1000 * 60 * 60 * 24))

  const esRenovacion = (prestamo.numero_renovacion ?? 0) > 0

  return (
    <div className={`pcard ${vencido ? 'pcard--vencido' : ''}`}>
      <div className="pcard__header">
        <div className="pcard__usuario">
          <span className="pcard__nombre">{prestamo.nombre_apellido}</span>
          <span className="pcard__detalle">{prestamo.correo} · CI: {prestamo.ci}</span>
        </div>
        <div className="pcard__badges">
          <span className={`pcard__badge ${prestamo.es_reserva ? 'badge--reserva' : 'badge--prestamo'}`}>
            {prestamo.es_reserva ? 'Reserva' : 'Préstamo'}
          </span>
          {esRenovacion && (
            <span className="pcard__badge badge--renovacion">
              Renovación {prestamo.numero_renovacion}
            </span>
          )}
        </div>
      </div>

      <div className="pcard__info">
        <div className="pcard__info-item">
          <span className="pcard__info-label">Préstamo</span>
          <span className="pcard__info-value">#{prestamo.id_prestamo_original ?? prestamo.id_prestamo}</span>
        </div>

        <div className="pcard__info-item">
          <span className="pcard__info-label">Aprobado</span>
          <span className="pcard__info-value">{formatFecha(prestamo.fecha_respuesta)}</span>
        </div>

        <div className="pcard__info-item">
          <span className="pcard__info-label">Activado</span>
          <span className="pcard__info-value">{formatFecha(prestamo.fecha_activacion)}</span>
        </div>

        {/* Solo para renovaciones: fecha en que se aprobó esta renovación */}
        {esRenovacion && prestamo.fecha_renovacion && (
          <div className="pcard__info-item">
            <span className="pcard__info-label">Renovado el</span>
            <span className="pcard__info-value pcard__info-value--renovacion">
              {formatFecha(prestamo.fecha_renovacion)}
            </span>
          </div>
        )}

        <div className="pcard__info-item">
          <span className="pcard__info-label">Vence</span>
          <span className={`pcard__info-value ${vencido ? 'text-rojo' : diasRestantes <= 1 ? 'text-amarillo' : ''}`}>
            {formatFecha(prestamo.fecha_tope_devolucion)}
            {vencido
              ? ' (vencido)'
              : diasRestantes === 0
                ? ' (hoy)'
                : diasRestantes === 1
                  ? ' (mañana)'
                  : ''}
          </span>
        </div>

        <div className="pcard__info-item">
          <span className="pcard__info-label">Pendientes</span>
          <span className="pcard__info-value">
            {prestamo.ejemplares_pendientes} ejemplar{prestamo.ejemplares_pendientes > 1 ? 'es' : ''}
          </span>
        </div>
      </div>

      <button className="pcard__btn" onClick={() => onGestionar(prestamo.id_prestamo)}>
        Gestionar devolución
      </button>
    </div>
  )
}

export default PrestamoActivoCard