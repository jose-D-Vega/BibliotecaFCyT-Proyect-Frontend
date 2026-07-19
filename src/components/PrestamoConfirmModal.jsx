import { useState, useEffect } from "react"

import { approveRenewal, rejectRenewal, respondDetalleBatch } from "../services/loans.services"
import { capitalizeWords } from "../utils/textFormatters"

import "./styles/PrestamoConfirmModal.css"

function PrestamoConfirmModal({
  open,
  solicitud,
  action,
  onClose,
  onSuccess
}) {

  const isReserva = solicitud?.modo === "RESERVA"
  const isRenovacion = solicitud?.modo === "RENOVACION"

  const [observaciones, setObservaciones] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [loadingApprove, setLoadingApprove] = useState(false)
  const [loadingReject, setLoadingReject] = useState(false)

  const [openAccepted, setOpenAccepted] = useState(false)
  const [openRejected, setOpenRejected] = useState(false)

  useEffect(() => {
    if (open) {
      setOpenAccepted(false)
      setOpenRejected(false)
      setObservaciones("")
      setLoading(false)
      setError("")
      setLoadingApprove(false)
      setLoadingReject(false)
    }
  }, [open])

  if (!open || !solicitud) return null

  const selectedCopies = solicitud.selectedCopies || []

  const acceptedCopies = []
  const rejectedCopies = []

  solicitud.materiales.forEach((material) => {
    material.ejemplares.forEach((ejemplar) => {

      const data = {
        ejemplar,
        titulo: material.titulo
      }

      if (selectedCopies.includes(ejemplar)) {
        acceptedCopies.push(data)
      } else {
        rejectedCopies.push(data)
      }
    })
  })

  const parseDate = (str) => {
    if (!str) return null
    const iso = new Date(str)
    if (!isNaN(iso)) return iso
    return null
  }

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("es-ES") : "—"

  const currentDueDate = parseDate(
    solicitud.fecha_tope_devolucion ||
    solicitud.fechaEntrega ||
    solicitud.fecha
  )

  const today = new Date()
  const newDueDate = new Date(today)
  newDueDate.setDate(today.getDate() + 5)

  // -------------------------
  // APPROVE RENOVATION
  // -------------------------
  const handleApproveRenewal = async () => {
    try {
      setLoadingApprove(true)

      await approveRenewal(solicitud.id)

      onSuccess?.()
      onClose()

    } catch (err) {
      console.error(err)
    } finally {
      setLoadingApprove(false)
    }
  }

  // -------------------------
  // REJECT RENOVATION
  // -------------------------
  const handleRejectRenewal = async () => {
    try {
      setLoadingReject(true)

      await rejectRenewal(solicitud.id)

      onSuccess?.()
      onClose()

    } catch (err) {
      console.error(err)
    } finally {
      setLoadingReject(false)
    }
  }

  // -------------------------
  // NORMAL FLOW
  // -------------------------
  const handleConfirm = async () => {
    try {
      setLoading(true)
      setError("")

      const respuestas = solicitud.materiales.flatMap(m =>
        m.ejemplares.map(e => {
          const accepted = selectedCopies.includes(e)
          return {
            id_ejemplar: e,
            estado: accepted ? "aprobado" : "rechazado",
            observaciones: accepted ? "" : observaciones
          }
        })
      )

      await respondDetalleBatch(solicitud.id, respuestas)

      onSuccess?.()
      onClose()

    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.error ||
        "Ocurrió un error inesperado al confirmar la solicitud."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="prestamo-modal-overlay">

      <div className="prestamo-modal">

        <div className="prestamo-modal__header">

          <div>
            <h2>
              Confirmar{" "}
              {isReserva
                ? "reserva"
                : isRenovacion
                  ? "renovación"
                  : "solicitud"}
            </h2>

            <p>
              {isRenovacion
                ? "Se aplicará una extensión de 5 días desde hoy."
                : "Revisa los ejemplares antes de continuar."}
            </p>
          </div>

          <button
            className="prestamo-modal__close"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        {isRenovacion && (
          <div className="renewal-badge">
            <div className="renewal-badge__item">
              <span>Devolución actual</span>
              <strong>{formatDate(currentDueDate)}</strong>
            </div>

            <div className="renewal-badge__arrow">→</div>

            <div className="renewal-badge__item renewal-badge__item--new">
              <span>Nueva devolución</span>
              <strong>{newDueDate.toLocaleDateString("es-ES")}</strong>
            </div>
          </div>
        )}

        <div className="prestamo-modal__box">
          <strong>{capitalizeWords(solicitud.usuario)}</strong>
        </div>

        {!isRenovacion && (
          <div className="prestamo-modal__scroll">
            {acceptedCopies.length > 0 && (
              <div className="prestamo-section-card">
                <button
                  className="prestamo-dropdown"
                  onClick={() => setOpenAccepted(!openAccepted)}
                >
                  <div className="prestamo-dropdown__left">
                    <h3>
                      Ejemplares {isReserva ? "reservados" : "aceptados"}
                    </h3>
                    <span>{acceptedCopies.length}</span>
                  </div>
                  <div className="prestamo-dropdown__arrow">▼</div>
                </button>

                {openAccepted && (
                  <div className="prestamo-section__list">
                    {acceptedCopies.map((item, idx) => (
                      <div key={idx} className="prestamo-copy prestamo-copy--accepted">
                        <div className="prestamo-copy__icon">✓</div>
                        <div className="prestamo-copy__info">
                          <strong>{item.ejemplar}</strong>
                          <span>{item.titulo}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {rejectedCopies.length > 0 && (
              <div className="prestamo-section-card">
                <button
                  className="prestamo-dropdown"
                  onClick={() => setOpenRejected(!openRejected)}
                >
                  <div className="prestamo-dropdown__left">
                    <h3>Ejemplares rechazados</h3>
                    <span>{rejectedCopies.length}</span>
                  </div>
                  <div className="prestamo-dropdown__arrow">▼</div>
                </button>

                {openRejected && (
                  <>
                    <div className="prestamo-section__list">
                      {rejectedCopies.map((item, idx) => (
                        <div key={idx} className="prestamo-copy prestamo-copy--rejected">
                          <div className="prestamo-copy__icon">✕</div>
                          <div className="prestamo-copy__info">
                            <strong>{item.ejemplar}</strong>
                            <span>{item.titulo}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="prestamo-observaciones">
                      <label>Observaciones</label>
                      <textarea
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        placeholder="Motivo del rechazo..."
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <div className="prestamo-modal__actions">

          {error && (
            <p style={{ color: "#f87171", fontSize: "0.875rem", width: "100%", margin: "0 0 8px" }}>
              {error}
            </p>
          )}

          <button className="cancel-btn" onClick={onClose}>
            Cancelar
          </button>

          {isRenovacion ? (
            <>
              <button
                className="cancel-btn"
                onClick={handleRejectRenewal}
                disabled={loadingReject || loadingApprove}
              >
                {loadingReject ? "Procesando..." : "Rechazar renovación"}
              </button>

              <button
                className="accept-btn"
                onClick={handleApproveRenewal}
                disabled={loadingReject || loadingApprove}
              >
                {loadingApprove ? "Procesando..." : "Aprobar renovación"}
              </button>
            </>
          ) : (
            <button
              className="accept-btn"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Procesando..." : "Confirmar"}
            </button>
          )}

        </div>

      </div>
    </div>
  )
}

export default PrestamoConfirmModal