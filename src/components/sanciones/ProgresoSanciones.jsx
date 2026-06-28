const TIPOS_LABELS = {
  falta_entrega:     'Falta de entrega',
  devolucion_tardia: 'Devolución tardía',
  deterioro:         'Material dañado',
  perdida:           'Material perdido',
  comportamiento:    'Comportamiento',
}

const ProgresoSanciones = ({ tiposPendientesInicial, tipoActual }) => {
  const indiceActual = tiposPendientesInicial.indexOf(tipoActual)

  return (
    <div className="sancion-progreso">
      <div className="sancion-progreso__pasos">
        {tiposPendientesInicial.map((tipo, i) => {
          const completado = i < indiceActual
          const activo     = i === indiceActual
          return (
            <div
              key={tipo}
              className={`sancion-progreso__paso${completado ? ' completado' : ''}${activo ? ' activo' : ''}`}
            >
              <span className="sancion-progreso__num">{completado ? '✓' : i + 1}</span>
              <span className="sancion-progreso__label">{TIPOS_LABELS[tipo]}</span>
            </div>
          )
        })}
      </div>

      <p className="sancion-progreso__hint">
        {indiceActual < tiposPendientesInicial.length - 1
          ? `Después confirmarás: "${TIPOS_LABELS[tiposPendientesInicial[indiceActual + 1]]}"`
          : 'Esta es la última sanción del lote.'
        }
      </p>
    </div>
  )
}

export default ProgresoSanciones