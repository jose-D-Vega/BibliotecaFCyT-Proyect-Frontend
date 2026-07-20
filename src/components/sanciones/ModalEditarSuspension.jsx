import { useState } from 'react'
import './SancionesComponents.css'

const ModalEditarSuspension = ({ sancion, onGuardar, onCancelar, loading }) => {
  const esIndefinidaActual = sancion.dias_suspension === null || sancion.dias_suspension === undefined
  const [indefinida, setIndefinida] = useState(esIndefinidaActual)
  const [dias,       setDias]       = useState(esIndefinidaActual ? '' : String(sancion.dias_suspension))
  const [error,      setError]      = useState(null)

  // Calcular mínimo de días válidos: los que hacen que fecha_fin >= hoy
  // fecha_fin = fecha_sancion + dias, entonces dias >= hoy - fecha_sancion
  const fechaSancion = new Date(sancion.fecha_sancion)
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  fechaSancion.setHours(0, 0, 0, 0)
  const diasTranscurridos = Math.floor((hoy - fechaSancion) / (1000 * 60 * 60 * 24))
  const diasMinimos = diasTranscurridos + 1  // al menos 1 día desde hoy

  const handleChangeDias = (e) => {
    // Solo permitir dígitos — bloquear cualquier otro carácter
    const valor = e.target.value.replace(/[^0-9]/g, '')
    setDias(valor)
    setError(null)
  }

  const handleGuardar = () => {
    if (!indefinida) {
      const n = parseInt(dias)
      if (!dias || isNaN(n)) {
        setError('Ingresá una cantidad de días válida')
        return
      }
      if (n < diasMinimos) {
        setError(
          `Con ${n} día${n !== 1 ? 's' : ''} la suspensión ya habría vencido. ` +
          `El mínimo es ${diasMinimos} día${diasMinimos !== 1 ? 's' : ''} desde la fecha de la sanción.`
        )
        return
      }
    }
    onGuardar(indefinida ? null : parseInt(dias))
  }

  // Calcular fecha de fin estimada para mostrar al usuario
  const fechaFinEstimada = () => {
    if (indefinida || !dias || isNaN(parseInt(dias))) return null
    const f = new Date(sancion.fecha_sancion)
    f.setDate(f.getDate() + parseInt(dias))
    const partes = f.toISOString().split('T')[0].split('-')
    return `${partes[2]}/${partes[1]}/${partes[0]}`
  }

  const fechaFin = fechaFinEstimada()

  return (
    <div className="modal-sancion-overlay overlay-in-card" onClick={onCancelar}>
      <div className="modal-sancion-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>

        <div className="modal-sancion__header">
          <div>
            <h2 className="modal-sancion__title">Editar suspensión</h2>
            <p className="modal-sancion__subtitle">Sanción #{sancion.id_sancion}</p>
          </div>
          <button className="modal-dev__cerrar" onClick={onCancelar}>✕</button>
        </div>

        <div className="modal-sancion__body" style={{ gap: '1rem' }}>

          <label style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            cursor: 'pointer', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)'
          }}>
            <input
              type="checkbox"
              checked={indefinida}
              onChange={e => {
                setIndefinida(e.target.checked)
                setDias('')
                setError(null)
              }}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            Suspensión indefinida
          </label>

          {!indefinida && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
                Días de suspensión <span style={{ color: 'rgba(255,255,255,0.3)' }}>(mínimo {diasMinimos})</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                className="nueva-sancion-input"
                value={dias}
                onChange={handleChangeDias}
                placeholder={`Mínimo ${diasMinimos} días`}
              />
            </div>
          )}

          {error && (
            <p className="sanciones-error" style={{ margin: 0 }}>{error}</p>
          )}

          {!indefinida && fechaFin && !error && (
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              Nueva fecha de fin de suspensión: <strong style={{ color: 'rgba(255,255,255,0.65)' }}>{fechaFin}</strong>
            </p>
          )}

        </div>

        <div className="modal-dev__footer">
          <button className="modal-dev__btn-cancelar" onClick={onCancelar} disabled={loading}>
            Cancelar
          </button>
          <button className="sancion-btn sancion-btn--resolver" onClick={handleGuardar} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalEditarSuspension