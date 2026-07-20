import "./styles/ModalExitoNuevoMaterial.css"

function ModalExitoNuevoMaterial({
  open,
  onClose
}) {

  if (!open) return null

  return (
    <div className="success-modal-overlay">

      <div className="success-modal">

        <div className="success-icon">
          ✓
        </div>

        <h2>
          Material agregado con éxito
        </h2>

        <p>
          El material fue registrado correctamente.
        </p>

        <button
          className="success-btn"
          onClick={onClose}
        >
          Aceptar
        </button>

      </div>

    </div>
  )
}

export default ModalExitoNuevoMaterial