 import { useEffect, useRef, useState } from "react"
import "./styles/SolicitudFilters.css"

function SolicitudFilters({
  filtro,
  setFiltro,
  setPage
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const opciones = [
    "TODAS",
    "PRESTAMO",
    "RESERVA",
    "RENOVACION"
  ]

  const labels = {
    TODAS: "Todas las solicitudes",
    PRESTAMO: "Préstamos",
    RESERVA: "Reservas",
    RENOVACION: "Renovaciones"
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="solicitud-filters">

      <div className="solicitud-filter-dropdown" ref={ref}>

        <button
          className="solicitud-filter-btn"
          onClick={() => setOpen(!open)}
        >

          <div className="solicitud-filter-btn__left">
            <span>Tipo</span>
            <span className="solicitud-filter-arrow">
              {open ? "▲" : "▼"}
            </span>
          </div>

          <span className="solicitud-filter-selected">
            {labels[filtro]}
          </span>

        </button>

        {open && (
          <div className="solicitud-filter-menu">

            {opciones.map((op) => (
              <button
                key={op}
                className={filtro === op ? "active" : ""}
                onClick={() => {
                  setFiltro(op)
                  setPage(1)
                  setOpen(false)
                }}
              >
                {labels[op]}
              </button>
            ))}

          </div>
        )}

      </div>

    </div>
  )
}

export default SolicitudFilters