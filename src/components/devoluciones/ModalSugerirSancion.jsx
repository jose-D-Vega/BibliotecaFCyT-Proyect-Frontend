import { useState } from 'react'

const ModalSugerirSancion = ({ sancionInfo, id_prestamo, onCerrar, onNavegar }) => {
  const [seleccionadas, setSeleccionadas] = useState({
    devolucion_tardia: false,
    deterioro: false
  })

  const toggleOpcion = (tipo) => {
    setSeleccionadas(prev => ({ ...prev, [tipo]: !prev[tipo] }))
  }

  const hayAlgoSeleccionado = Object.values(seleccionadas).some(Boolean)

  const handleIrASancionar = () => {
    const params = new URLSearchParams()
    params.set('id_prestamo', id_prestamo)

    // Separar los ejemplares por tipo:
    // devolucion_tardia -> todos los ejemplares del préstamo
    // deterioro         -> solo los ejemplares con problema (dañados)
    const idsTodos  = sancionInfo.todosLosEjemplares.map(e => e.id_ejemplar)
    const idsDanio  = sancionInfo.ejemplaresConProblema.map(e => e.id_ejemplar)

    const tipos = []
    if (seleccionadas.devolucion_tardia) tipos.push('devolucion_tardia')
    if (seleccionadas.deterioro)         tipos.push('deterioro')

    // Pasar id_ejemplares por query param para el primer tipo
    const primerTipo = tipos[0]
    if (primerTipo === 'devolucion_tardia') {
      params.set('id_ejemplares', idsTodos.join(','))
    } else if (primerTipo === 'deterioro') {
      params.set('id_ejemplares', idsDanio.join(','))
    }

    onNavegar(`/admin/sanciones/nueva?${params.toString()}`, {
      // location.state para los tipos pendientes y los ids del tipo deterioro
      tiposPendientes: tipos,
      idEjemplaresDanio: idsDanio  // lo usa NuevaSancionPage cuando el tipo activo es 'deterioro'
    })
  }

  const opcionVencido = sancionInfo.vencido
  const opcionDanio = sancionInfo.ejemplaresConProblema.length > 0
  const cantSeleccionadas = Object.values(seleccionadas).filter(Boolean).length

  return (
    <div className="modal-dev-overlay" onClick={onCerrar}>
      <div className="modal-dev-box" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div className="modal-dev__header">
          <div>
            <h2 className="modal-dev__title">¿Registrar sanciones?</h2>
            <p className="modal-dev__subtitle">Seleccioná las infracciones que quieras registrar</p>
          </div>
          <button className="modal-dev__cerrar" onClick={onCerrar}>✕</button>
        </div>

        <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {opcionVencido && (
            <label className="nueva-sancion-ejemplar-check">
              <input
                type="checkbox"
                checked={seleccionadas.devolucion_tardia}
                onChange={() => toggleOpcion('devolucion_tardia')}
              />
              <span>
                <strong>Devolución tardía</strong><br />
                <small>
                  {sancionInfo.todosLosEjemplares.length} ejemplar{sancionInfo.todosLosEjemplares.length > 1 ? 'es' : ''} devuelto{sancionInfo.todosLosEjemplares.length > 1 ? 's' : ''} fuera de plazo
                </small>
              </span>
            </label>
          )}

          {opcionDanio && (
            <label className="nueva-sancion-ejemplar-check">
              <input
                type="checkbox"
                checked={seleccionadas.deterioro}
                onChange={() => toggleOpcion('deterioro')}
              />
              <span>
                <strong>Material dañado</strong><br />
                <small>
                  {sancionInfo.ejemplaresConProblema.length} ejemplar{sancionInfo.ejemplaresConProblema.length > 1 ? 'es' : ''} devuelto{sancionInfo.ejemplaresConProblema.length > 1 ? 's' : ''} en mal estado
                </small>
              </span>
            </label>
          )}

          <button
            className="sancion-btn sancion-btn--primario"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            onClick={handleIrASancionar}
            disabled={!hayAlgoSeleccionado}
          >
            Ir a registrar {cantSeleccionadas > 1 ? 'sanciones' : 'sanción'}
          </button>

          <button
            className="modal-dev__btn-cancelar"
            style={{ width: '100%' }}
            onClick={onCerrar}
          >
            No registrar sanción
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalSugerirSancion