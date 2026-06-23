import { useState } from "react"

import PrestamoEstadoBadge from "./PrestamoEstadoBadge"
import PrestamoDetalleModal from "./PrestamoDetalleModal"

import "./styles/PrestamoCard.css"

const API_URL = "http://localhost:3210/api"

/* ----------------- helpers ----------------- */

function capitalizeWords(text) {
  return (text || "")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function formatCount(value, singular, plural) {
  return `${value} ${value === 1 ? singular : plural}`
}

/* ------------------------------------------ */

function PrestamoCard({ prestamo, onUpdated }) {
  const [openDetails, setOpenDetails] = useState(false)
  const [openCancelModal, setOpenCancelModal] = useState(false)
  const [loadingCancel, setLoadingCancel] = useState(false)

  const [openActivateModal, setOpenActivateModal] = useState(false)
  const [loadingActivate, setLoadingActivate] = useState(false)

  const estado = (prestamo.estado || "").toLowerCase()

  const puedeCancelar = [
    "aprobado",
    "parcialmente_aprobado",
    "reserva_aprobada",
    "reserva_parcialmente_aprobada"
  ].includes(estado)

  const puedeActivar = [
    "aprobado",
    "parcialmente_aprobado"
  ].includes(estado)

  const materiales = prestamo.materiales || prestamo.detalles || []

  const totalMateriales = materiales.length
  const totalEjemplares = materiales.reduce(
    (acc, m) => acc + (m.ejemplares?.length || 0),
    0
  )

  function getFechaDevolucion() {
    const d = new Date()
    d.setDate(d.getDate() + 5)
    return d.toLocaleDateString("es-PY")
  }

  async function handleConfirmCancel() {
    try {
      setLoadingCancel(true)

      const token = localStorage.getItem("token")

      const res = await fetch(`${API_URL}/loans/${prestamo.id}/cancel-smart`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data?.error || "Error al cancelar préstamo")
        return
      }

      setOpenCancelModal(false)
      onUpdated?.()

    } catch (err) {
      console.error(err)
      alert("Error de conexión")
    } finally {
      setLoadingCancel(false)
    }
  }

  async function handleConfirmActivate() {
    try {
      setLoadingActivate(true)

      const token = localStorage.getItem("token")

      const res = await fetch(`${API_URL}/loans/${prestamo.id}/activate`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data?.error || "Error al activar préstamo")
        return
      }

      setOpenActivateModal(false)
      onUpdated?.()

    } catch (err) {
      console.error(err)
      alert("Error de conexión")
    } finally {
      setLoadingActivate(false)
    }
  }

  let tituloFechaIzquierda = ""
  let valorFechaIzquierda = ""
  let tituloFechaDerecha = ""
  let valorFechaDerecha = ""

switch (estado) {
  case "aprobado":
    tituloFechaIzquierda = "Aprobado en"
    valorFechaIzquierda = prestamo.fechaRespuesta
    break

  case "parcialmente_aprobado":
    tituloFechaIzquierda = "Parcialmente aprobado en"
    valorFechaIzquierda = prestamo.fechaRespuesta
    break

  case "reserva_aprobada":
    tituloFechaIzquierda = "Reserva aprobada en"
    valorFechaIzquierda = prestamo.fechaRespuesta
    break

  case "reserva_parcialmente_aprobada":
    tituloFechaIzquierda = "Reserva parcialmente aprobada en"
    valorFechaIzquierda = prestamo.fechaRespuesta
    break

  case "rechazado":
    tituloFechaIzquierda = "Rechazado en"
    valorFechaIzquierda = prestamo.fechaRespuesta
    break

  case "vencido":
    tituloFechaIzquierda = "Fecha tope devolución"
    valorFechaIzquierda = prestamo.fechaEntrega
    break

  case "activo":
    tituloFechaIzquierda = "Activado en"
    valorFechaIzquierda = prestamo.fechaActivacion
    tituloFechaDerecha = "Devolución máxima"
    valorFechaDerecha = prestamo.fechaEntrega
    break

  case "devuelto":
    tituloFechaIzquierda = "Fecha tope devolución"
    valorFechaIzquierda = prestamo.fechaEntrega
    tituloFechaDerecha = "Se devolvió en"
    valorFechaDerecha = prestamo.fechaDevolucion
    break

  default:
    tituloFechaIzquierda = "Fecha"
    valorFechaIzquierda = prestamo.fechaPrestamo
}

  return (
    <>
      <article className="prestamo-card">

        {/* LEFT SIDE */}
        <div className="prestamo-card__main">

          <div className="prestamo-card__user">
            <h2 title={prestamo.usuario}>
              {capitalizeWords(prestamo.usuario)}
            </h2>

            <div className="prestamo-card__meta">
              <span>
                {formatCount(totalMateriales, "material", "materiales")} ·{" "}
                {formatCount(totalEjemplares, "ejemplar", "ejemplares")}
              </span>
            </div>
          </div>

          <div className="prestamo-card__dates">
            <div>
              <p>{tituloFechaIzquierda}</p>
              <strong>{valorFechaIzquierda}</strong>
            </div>

            {tituloFechaDerecha && (
              <div>
                <p>{tituloFechaDerecha}</p>
                <strong>{valorFechaDerecha}</strong>
              </div>
            )}
          </div>

          <div className="prestamo-card__badge-slot">
            <PrestamoEstadoBadge estado={estado} />
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="prestamo-card__actions">

          {puedeCancelar && (
            <button
              className="prestamo-card__btn prestamo-card__btn--cancel"
              onClick={() => setOpenCancelModal(true)}
            >
              Cancelar
            </button>
          )}

          {puedeActivar && (
            <button
              className="prestamo-card__btn prestamo-card__btn--activate"
              onClick={() => setOpenActivateModal(true)}
            >
              Activar
            </button>
          )}

          <button
            className="prestamo-card__btn prestamo-card__btn--details"
            onClick={() => setOpenDetails(true)}
          >
            Ver detalles →
          </button>
        </div>
      </article>

      <PrestamoDetalleModal
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        prestamo={{ ...prestamo, materiales }}
        estadoActual={estado}
        puedeCancelar={puedeCancelar}
        puedeActivar={puedeActivar}

        openCancelModal={openCancelModal}
        setOpenCancelModal={setOpenCancelModal}

        openActivateModal={openActivateModal}
        setOpenActivateModal={setOpenActivateModal}

        handleConfirmCancel={handleConfirmCancel}
        handleConfirmActivate={handleConfirmActivate}

        loadingActivate={loadingActivate}
        loadingCancel={loadingCancel}
      />

      {/* ================= CANCEL MODAL (ISOLATED) ================= */}
      {openCancelModal && (
        <div className="prestamo-card__modal-overlay">
          <div className="prestamo-card__modal">

            <h3>Cancelar préstamo</h3>

            <p>
              ¿Seguro que querés cancelar este préstamo?
              <br />
              Esta acción revierte el estado del proceso.
            </p>

            <div className="prestamo-card__modal-actions">

              <button
                className="prestamo-card__modal-btn prestamo-card__modal-btn--secondary"
                onClick={() => setOpenCancelModal(false)}
              >
                No
              </button>

              <button
                className="prestamo-card__modal-btn prestamo-card__modal-btn--danger"
                onClick={handleConfirmCancel}
              >
                {loadingCancel ? "Cancelando..." : "Sí, cancelar"}
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ================= ACTIVATE MODAL (ISOLATED) ================= */}
      {openActivateModal && (
        <div className="prestamo-card__modal-overlay">
          <div className="prestamo-card__modal">

            <h3>Activar préstamo</h3>

            <p>
              Solo activar cuando el usuario retiró los materiales.
            </p>

            <div className="prestamo-card__activate-info">
              <p>
                <strong>Fecha actual:</strong>{" "}
                {new Date().toLocaleDateString("es-PY")}
              </p>

              <p>
                <strong>Fecha máxima de devolución:</strong>{" "}
                {getFechaDevolucion()}
              </p>
            </div>

            <div className="prestamo-card__modal-actions">

              <button
                className="prestamo-card__modal-btn prestamo-card__modal-btn--secondary"
                onClick={() => setOpenActivateModal(false)}
              >
                Cancelar
              </button>

              <button
                className="prestamo-card__modal-btn prestamo-card__modal-btn--success"
                onClick={handleConfirmActivate}
              >
                {loadingActivate ? "Activando..." : "Confirmar"}
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PrestamoCard