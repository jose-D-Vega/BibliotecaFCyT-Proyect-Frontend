const SelectorEjemplares = ({
  ejemplares,
  seleccionados,
  onToggle,
  forzados,          // ids que van pre-marcados y no se pueden desmarcar
  descripcionesPorEjemplar,
  onDescripcionChange,
  requiereDescripcionIndividual,
}) => {
  if (!ejemplares || ejemplares.length === 0)
    return <p className="ns-hint">Este préstamo no tiene ejemplares asociados.</p>

  return (
    <div className="ns-ejemplares-wrap">
      <div className="ns-ejemplares">
        {ejemplares.map(det => {
          const esForzado = forzados?.includes(det.id_ejemplar)
          const marcado   = seleccionados.includes(det.id_ejemplar)
          return (
            <label
              key={det.id_ejemplar}
              className={`nueva-sancion-ejemplar-check${esForzado ? ' forzado' : ''}`}
            >
              <input
                type="checkbox"
                checked={marcado}
                onChange={() => { if (!esForzado) onToggle(det.id_ejemplar) }}
                disabled={esForzado}
              />
              <span>
                <strong>#{det.id_ejemplar}</strong> — {det.titulo} ({det.autor})
                <span className="ns-ejemplar-estado"> · {det.estado_prestamo_ejemplar}</span>
                {esForzado && <em className="ns-ejemplar-danio"> · material dañado</em>}
              </span>
            </label>
          )
        })}
      </div>

      {/* Descripciones individuales — deterioro y pérdida */}
      {requiereDescripcionIndividual && seleccionados.length > 0 && (
        <div className="ns-descripciones-wrap">
          {seleccionados.map(id_ejemplar => {
            const det = ejemplares.find(e => e.id_ejemplar === id_ejemplar)
            return (
              <div key={id_ejemplar} className="nueva-sancion-field">
                <label>
                  Descripción — ejemplar #{id_ejemplar}{det ? ` · ${det.titulo}` : ''} *
                </label>
                <textarea
                  value={descripcionesPorEjemplar[id_ejemplar] || ''}
                  onChange={e => onDescripcionChange(id_ejemplar, e.target.value)}
                  placeholder="Describí el estado o la situación de este ejemplar..."
                  className="nueva-sancion-textarea"
                  rows={3}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SelectorEjemplares