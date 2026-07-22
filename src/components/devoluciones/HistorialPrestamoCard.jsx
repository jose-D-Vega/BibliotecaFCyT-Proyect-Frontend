import './DevolucionesComponents.css'

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const partes = fecha.split('T')[0].split('-')
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

const HistorialPrestamoCard = ({ prestamo, onVerDetalle }) => {
  const devueltoCompleto = parseInt(prestamo.ejemplares_devueltos) === parseInt(prestamo.total_ejemplares)
  const tieneProblemas = prestamo.tiene_problemas
  const esRenovacion = prestamo.numero_renovacion > 0

  let estadoCard = 'completo'
  if (!devueltoCompleto) estadoCard = 'parcial'
  if (tieneProblemas) estadoCard = 'problema'

  return (
    <div className={`hcard hcard--${estadoCard}`}>

      <div className="hcard__header">
        <div className="hcard__usuario">
          <span className="hcard__nombre">{prestamo.nombre_apellido}</span>
          <span className="hcard__detalle">{prestamo.correo} 
            <br />
            CI: {prestamo.ci}</span>
        </div>
        <div className="hcard__badges">
          <span className={`pcard__badge ${estadoCard === 'completo' ? 'badge--verde' : estadoCard === 'problema' ? 'badge--rojo' : 'badge--amarillo'}`}>
            {estadoCard === 'completo' ? 'Devuelto' : estadoCard === 'problema' ? 'Con problemas' : 'Parcial'}
          </span>
          {esRenovacion && (
            <span className="pcard__badge badge--renovacion">
              Renovación #{prestamo.numero_renovacion}
            </span>
          )}
        </div>
      </div>

      <div className="hcard__info">
        <div className="pcard__info-item">
          <span className="pcard__info-label">Préstamo</span>
          <span className="pcard__info-value">
            #{prestamo.id_prestamo_original ?? prestamo.id_prestamo}
          </span>
        </div>
        {esRenovacion && (
          <div className="pcard__info-item">
            <span className="pcard__info-label">Renovación</span>
            <span className="pcard__info-value">#{prestamo.numero_renovacion} (ID #{prestamo.id_prestamo})</span>
          </div>
        )}
        <div className="pcard__info-item">
          <span className="pcard__info-label">{esRenovacion ? 'Renovación activada' : 'Activado'}</span>
          <span className="pcard__info-value">{formatFecha(prestamo.fecha_activacion)}</span>
        </div>
        <div className="pcard__info-item">
          <span className="pcard__info-label">Fecha tope</span>
          <span className="pcard__info-value">{formatFecha(prestamo.fecha_tope_devolucion)}</span>
        </div>
        <div className="pcard__info-item">
          <span className="pcard__info-label">Libros</span>
          <span className="pcard__info-value">{prestamo.total_libros}</span>
        </div>
        <div className="pcard__info-item">
          <span className="pcard__info-label">Ejemplares</span>
          <span className="pcard__info-value">
            {prestamo.ejemplares_devueltos}/{prestamo.total_ejemplares}
          </span>
        </div>
        <div className="pcard__info-item">
          <span className="pcard__info-label">Activado Por:</span>
          <span className="pcard__info-value">{prestamo.bibliotecario_activacion || '—'}</span>
        </div>
      </div>

      <button className="pcard__btn" onClick={() => onVerDetalle(prestamo)}>
        Ver detalle
      </button>
    </div>
  )
}

export default HistorialPrestamoCard