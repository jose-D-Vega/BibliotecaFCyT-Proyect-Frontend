import { useEffect, useRef, useState } from "react"
import "./styles/PrestamoFilters.css"

function PrestamoFilters({
  estadoFiltro,
  setEstadoFiltro
}) {
  const [openEstado, setOpenEstado] = useState(false)
  const estadoRef = useRef(null)

  const estados = [
    "Todos los estados",
    "Aprobado",
    "Parcialmente_aprobado",
    "Activo",
    "Devuelto",
    "Vencido",
    "Rechazado",
    "Reserva_aprobada",
    "Reserva_parcialmente_aprobada"
  ]

  useEffect(() => {
    function handleClickOutside(event) {
      if (estadoRef.current && !estadoRef.current.contains(event.target)) {
        setOpenEstado(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // 👇 solo para UI (NO afecta filtro)
  const formatLabel = (str) =>
    str
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <div className="prestamo-filters">

      <div className="prestamo-filter-dropdown" ref={estadoRef}>

        <button
          className="prestamo-filter-btn"
          onClick={() => setOpenEstado(!openEstado)}
        >
          <div className="prestamo-filter-btn__left">
            <span>Estado</span>
            <span className="prestamo-filter-arrow">
              {openEstado ? "▲" : "▼"}
            </span>
          </div>

          <span className="prestamo-filter-selected">
            {estadoFiltro === "Todos los estados"
              ? estadoFiltro
              : formatLabel(estadoFiltro)
            }
          </span>
        </button>

        {openEstado && (
          <div className="prestamo-filter-menu">

            {estados.map((estado) => (
              <button
                key={estado}
                className={estadoFiltro === estado ? "active" : ""}
                onClick={() => {
                  setEstadoFiltro(estado)
                  setOpenEstado(false)
                }}
              >
                {estado === "Todos los estados"
                  ? estado
                  : formatLabel(estado)
                }
              </button>
            ))}

          </div>
        )}

      </div>
    </div>
  )
}

export default PrestamoFilters