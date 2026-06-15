import PrestamoEstadoBadge from "./PrestamoEstadoBadge"
import "./styles/PrestamoDetalleModal.css"

function capitalizeWords(text) {
  return (text || "")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function PrestamoDetalleModal({
  open,
  onClose,
  prestamo,
  estadoActual,
  puedeCancelar,
  puedeActivar,
  observaciones,
  setObservaciones,
  openCancelModal,
  setOpenCancelModal,
  openActivateModal,
  setOpenActivateModal,
  handleConfirmCancel,
  handleConfirmActivate,
  loadingActivate = false,
  loadingCancel = false
}) {
  if (!open) return null

  const materiales = prestamo.materiales || []

  return (
    <>
      <div className="prestamo-detalle-overlay">
        <div className="prestamo-detalle-modal">

          {/* HEADER */}
          <div className="prestamo-detalle-header">
            <div>
              <h2>{capitalizeWords(prestamo.usuario)}</h2>
              <p>Préstamo registrado el {prestamo.fechaPrestamo}</p>
            </div>

            <button className="prestamo-detalle-close" onClick={onClose}>
              ✕
            </button>
          </div>

          {/* INFO */}
          <div className="prestamo-detalle-info">
            <div>
              <span>Estado</span>
              <PrestamoEstadoBadge estado={estadoActual} />
            </div>

            <div>
              <span>Devolución máxima</span>
              <strong>{prestamo.fechaEntrega}</strong>
            </div>
          </div>

          {/* CONTENT */}
          <div className="prestamo-detalle-content">
            {materiales.map((material, i) => (
              <div key={i} className="prestamo-material-item">

                <div className="prestamo-material-item__top">
                  <div className="prestamo-material-item__info">
                    <h3>{material.titulo}</h3>
                    <span>{material.autor}</span>
                  </div>

                  <div className="prestamo-material-item__quantity">
                    {material.ejemplares?.length || 0} ejemplares
                  </div>
                </div>

                <div className="prestamo-material-item__copies">
                  {(material.ejemplares || []).map((ejemplar, index) => (
                    <div key={index} className="prestamo-copy-row">
                      <div className="prestamo-copy-row__left">
                        <div className="prestamo-copy-row__icon">📘</div>
                        <span>Ejemplar #{ejemplar}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
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

      {/* ================= CANCEL MODAL ================= */}
      {openCancelModal && (
        <div className="prestamo-cancel-overlay">
<div className="prestamo-cancel-modal">

  <div className="prestamo-cancel-modal__header">
    <div>
      <h2>Cancelar préstamo</h2>
      <p>¿Estás seguro?</p>
    </div>

    <button
      className="prestamo-cancel-close"
      onClick={() => setOpenCancelModal(false)}
    >
      ✕
    </button>
  </div>

  <div className="prestamo-cancel-user">
    <strong>{capitalizeWords(prestamo.usuario)}</strong>
    <span>{estadoActual}</span>
  </div>

  <div className="prestamo-cancel-actions">
    <button
      className="prestamo-cancel-btn-secondary"
      onClick={() => setOpenCancelModal(false)}
    >
      Volver
    </button>

    <button
  className="prestamo-cancel-btn-primary"
  onClick={handleConfirmCancel}
  disabled={loadingCancel}
>
  {loadingCancel ? "Cancelando..." : "Confirmar cancelación"}
</button>
  </div>

</div>
        </div>
      )}

      {/* ================= ACTIVATE MODAL ================= */}
      {openActivateModal && (
        <div className="prestamo-cancel-overlay">
          <div className="prestamo-cancel-modal">

            <div className="prestamo-cancel-modal__header">
              <div>
                <h2>Activar préstamo</h2>
                <p>¿Confirmar activación?</p>
              </div>

              <button
                className="prestamo-cancel-close"
                onClick={() => setOpenActivateModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="prestamo-cancel-user">
              <strong>{capitalizeWords(prestamo.usuario)}</strong>
              <span>{estadoActual}</span>
            </div>

            <div className="prestamo-cancel-observaciones">
              <label>Información</label>

              <p style={{ color: "rgba(255,255,255,.7)" }}>
                Se marcará como activo y comenzará el conteo de devolución.
              </p>
            </div>

            <div className="prestamo-cancel-actions">

              <button
                className="prestamo-cancel-btn-secondary"
                onClick={() => setOpenActivateModal(false)}
              >
                Volver
              </button>

              <button
                className="prestamo-cancel-btn-success"
                onClick={handleConfirmActivate}
              >
                {loadingActivate ? "Activando..." : "Confirmar activación"}
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PrestamoDetalleModal