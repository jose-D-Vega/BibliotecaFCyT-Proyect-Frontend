import { useMemo, useState, useEffect } from "react"
import "./styles/PrestamoSolicitudModal.css"

function PrestamoSolicitudModal({
  open,
  onClose,
  solicitud,
  onAceptar
}) {

  const isReserva =
    solicitud?.tipoSolicitud === "Reserva"

  const isRenovacion =
    solicitud?.tipoSolicitud === "Renovación"

  const allCopies = useMemo(() => {
    return solicitud.materiales.flatMap(
      (material) =>
        material.ejemplares.map(
          (ejemplar) => ejemplar
        )
    )
  }, [solicitud])

  const [selectedCopies, setSelectedCopies] =
    useState(allCopies)

  useEffect(() => {
    if (open) {
      setSelectedCopies(allCopies)
    }
  }, [open, allCopies])

  const parseDate = (str) => {
    if (!str) return null

    const iso = new Date(str)
    if (!isNaN(iso)) return iso

    const parts = str.split("/")
    if (parts.length === 3) {
      const [d, m, y] = parts
      return new Date(`${y}-${m}-${d}`)
    }

    return null
  }

  const formatDate = (date) => {
    if (!date) return "—"
    const d = parseDate(date)
    if (!d) return "—"
    return d.toLocaleDateString("es-ES")
  }

  const renewalDays = 5

  const renewalInfo = useMemo(() => {
    if (!isRenovacion) return null

    const base = new Date()
    const newDateObj = new Date(base)
    newDateObj.setDate(base.getDate() + renewalDays)

    return {
      oldDate: formatDate(
        solicitud?.fecha_tope_devolucion ||
        solicitud?.fechaEntrega ||
        solicitud?.fecha ||
        null
      ),
      newDate: newDateObj.toLocaleDateString("es-ES")
    }
  }, [isRenovacion, solicitud])

  function toggleCopy(ejemplar) {
    if (isRenovacion) return

    setSelectedCopies((prev) =>
      prev.includes(ejemplar)
        ? prev.filter((item) => item !== ejemplar)
        : [...prev, ejemplar]
    )
  }
  function capitalizeWords(text) {
  return (text || "")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

  function selectAll() {
    if (isRenovacion) return
    setSelectedCopies(allCopies)
  }

  function clearAll() {
    if (isRenovacion) return
    setSelectedCopies([])
  }

  function handleConfirm() {
    onAceptar({
      ...solicitud,
      selectedCopies,
      modo: isReserva
        ? "RESERVA"
        : isRenovacion
        ? "RENOVACION"
        : "PRESTAMO"
    })
  }

  if (!open) return null

  return (
    <div className="solicitud-modal-overlay">

      <div className="solicitud-modal">

        <div className="solicitud-modal__header">

          <div>
            <h2>{capitalizeWords(solicitud.usuario)}</h2>
            <p>
              Solicitud de{" "}
              {isReserva
                ? "reserva"
                : isRenovacion
                ? "renovación"
                : "préstamo"}{" "}
              realizada el {solicitud.fecha}
            </p>
          </div>

          <button
            className="solicitud-modal__close"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        {/* 🔥 BANNER RENOVACIÓN */}
        {isRenovacion && renewalInfo && (
          <div className="renewal-badge">
            <div className="renewal-badge__item">
              <span>Devolución máxima actual</span>
              <strong>{renewalInfo.oldDate}</strong>
            </div>

            <div className="renewal-badge__arrow">→</div>

            <div className="renewal-badge__item renewal-badge__item--new">
              <span>Nueva devolución máxima</span>
              <strong>{renewalInfo.newDate}</strong>
            </div>
          </div>
        )}

        {/* 🔥 CONTROLES SELECT ALL / CLEAR ALL */}
        {!isRenovacion && (
          <div className="solicitud-modal__bulk-actions">
            <button
              type="button"
              className="bulk-btn bulk-btn--select"
              onClick={selectAll}
            >
              Seleccionar todo
            </button>

            <button
              type="button"
              className="bulk-btn bulk-btn--clear"
              onClick={clearAll}
            >
              Deseleccionar todo
            </button>
          </div>
        )}

        <div className="solicitud-modal__content">

          {solicitud.materiales.map((material) => (
            <div key={material.id} className="material-item">

              <div className="material-item__top">

                <div className="material-item__info">
                  <h3>{material.titulo}</h3>
                  <span>{material.autor}</span>
                </div>

                <div className="material-item__quantity">
                  {material.ejemplares.length} ejemplares
                </div>
              </div>

              <div className="material-item__copies">

                {material.ejemplares.map((ejemplar, index) => {

                  const checked =
                    selectedCopies.includes(ejemplar)

                  let rowClass = "copy-row"

                  if (isRenovacion) {
                    rowClass = "copy-row copy-row--renovacion"
                  } else if (checked) {
                    rowClass = `copy-row copy-row--active ${
                      isReserva ? "copy-row--reserva" : ""
                    }`
                  }

                  return (
                    <label key={index} className={rowClass}>

                      <div className="copy-row__left">
                        <div className="copy-row__icon">📕</div>
                        <span>Ejemplar #{ejemplar}</span>
                      </div>

                      {!isRenovacion && (
                        <div className="copy-row__right">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCopy(ejemplar)}
                          />
                          <div className="copy-row__check">✓</div>
                        </div>
                      )}

                    </label>
                  )
                })}
              </div>

            </div>
          ))}

        </div>

        <div className="solicitud-modal__actions">
          <button className="confirm-btn" onClick={handleConfirm}>
            Confirmar{" "}
            {isReserva
              ? "reserva"
              : isRenovacion
              ? "renovación"
              : "solicitud"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default PrestamoSolicitudModal