import "./styles/PrestamoDetalleModal.css";
import PrestamoDetalleInfo from "./PrestamoDetalleInfo";
import PrestamoDetalleEjemplares from "./PrestamoDetalleEjemplares.jsx";
import PrestamoAccionModal from "./PrestamoAccionModal.jsx";
import { capitalizeWords } from "../../utils/textFormatters.js";

function PrestamoDetalleModal({
  open,
  onClose,
  prestamo,
  estadoActual,

  puedeCancelar,
  puedeActivar,

  openCancelModal,
  setOpenCancelModal,

  openActivateModal,
  setOpenActivateModal,

  handleConfirmCancel,
  handleConfirmActivate,

  loadingActivate = false,
  loadingCancel = false,
}) {
  if (!open) return null;

  return (
    <>
      <div className="prestamo-detalle-overlay">
        <div className="prestamo-detalle-modal">
          <header className="prestamo-detalle-header">
            <div>
              <h2>{capitalizeWords(prestamo.usuario)}</h2>
            </div>

            <button className="prestamo-detalle-close" onClick={onClose}>
              ✕
            </button>
          </header>

          <PrestamoDetalleInfo prestamo={prestamo} estado={estadoActual} />

          <PrestamoDetalleEjemplares
            materiales={prestamo.materiales || []}
            detalles={prestamo.detalles || []}
            estado={estadoActual}
          />

          <div className="prestamo-detalle-actions">
            {puedeCancelar && (
              <button
                className="prestamo-detalle-btn prestamo-detalle-btn--cancel"
                onClick={() => setOpenCancelModal(true)}
              >
                Cancelar préstamo
              </button>
            )}

            {puedeActivar && (
              <button
                className="prestamo-detalle-btn prestamo-detalle-btn--activate"
                onClick={() => setOpenActivateModal(true)}
              >
                Activar préstamo
              </button>
            )}
          </div>
        </div>
      </div>

      {openCancelModal && (
        <PrestamoAccionModal
          tipo="cancelar"
          usuario={prestamo.usuario}
          estado={estadoActual}
          loading={loadingCancel}
          onClose={() => setOpenCancelModal(false)}
          onConfirm={handleConfirmCancel}
        />
      )}

      {openActivateModal && (
        <PrestamoAccionModal
          tipo="activar"
          usuario={prestamo.usuario}
          estado={estadoActual}
          loading={loadingActivate}
          onClose={() => setOpenActivateModal(false)}
          onConfirm={handleConfirmActivate}
        />
      )}
    </>
  );
}

export default PrestamoDetalleModal;
