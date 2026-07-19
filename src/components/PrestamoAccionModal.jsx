import { capitalizeWords, formatEstado } from "../utils/textFormatters";

function PrestamoAccionModal({
  tipo,
  usuario,
  estado,

  loading = false,

  onClose,
  onConfirm,
}) {
  const cancelar = tipo === "cancelar";

  return (
    <div className="prestamo-cancel-overlay">
      <div className="prestamo-cancel-modal">
        <div className="prestamo-cancel-modal__header">
          <div>
            <h2>{cancelar ? "Cancelar préstamo" : "Activar préstamo"}</h2>

            <p>{cancelar ? "¿Estás seguro?" : "¿Confirmar activación?"}</p>
          </div>

          <button className="prestamo-cancel-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="prestamo-cancel-user">
          <strong>{capitalizeWords(usuario)}</strong>

          <span>{formatEstado(estado)}</span>
        </div>

        {!cancelar && (
          <div className="prestamo-cancel-observaciones">
            <label>Información</label>

            <p>Se marcará como activo y comenzará el conteo de devolución.</p>
          </div>
        )}

        <div className="prestamo-cancel-actions">
          <button className="prestamo-cancel-btn-secondary" onClick={onClose}>
            Volver
          </button>

          <button
            className={
              cancelar
                ? "prestamo-cancel-btn-primary"
                : "prestamo-cancel-btn-success"
            }
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? cancelar
                ? "Cancelando..."
                : "Activando..."
              : cancelar
                ? "Confirmar cancelación"
                : "Confirmar activación"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrestamoAccionModal;
