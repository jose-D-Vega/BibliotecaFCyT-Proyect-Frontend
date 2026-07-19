import { useState } from 'react'
import './SancionesComponents.css'

const DESCRIPCION_REQUERIDA = ['deterioro', 'perdida']

const ModalEditarDescripcion = ({ sancion, onGuardar, onCancelar, loading }) => {
  const [descripcion, setDescripcion] = useState(sancion.descripcion_sancion || '')
  const [error,       setError]       = useState(null)

  const handleGuardar = () => {
    if (DESCRIPCION_REQUERIDA.includes(sancion.tipo_infraccion) && !descripcion.trim()) {
      setError('La descripción es obligatoria para este tipo de sanción')
      return
    }
    onGuardar(descripcion.trim())
  }

  return (
    <div className="modal-sancion-overlay overlay-in-card" onClick={onCancelar}>
      <div className="modal-sancion-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>

        <div className="modal-sancion__header">
          <div>
            <h2 className="modal-sancion__title">Editar descripción</h2>
            <p className="modal-sancion__subtitle">Sanción #{sancion.id_sancion}</p>
          </div>
          <button className="modal-dev__cerrar" onClick={onCancelar}>✕</button>
        </div>

        <div className="modal-sancion__body">
          <textarea
            className="nueva-sancion-input"
            style={{ resize: 'vertical', minHeight: 120, fontFamily: 'inherit' }}
            value={descripcion}
            onChange={e => { setDescripcion(e.target.value); setError(null) }}
            placeholder="Descripción de la sanción..."
          />
          {error && <p className="sanciones-error" style={{ margin: 0 }}>{error}</p>}
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

export default ModalEditarDescripcion