import React, { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

// Simula un <select> pero permite elegir varias opciones. Cerrado se ve como
// un input normal de filtro; al hacer click despliega un panel flotante con
// checkboxes que se cierra solo al clickear en cualquier otro lado de la página.
export default function MultiSelectDropdown({ options, seleccionados = [], onChange, placeholder = "Todos" }) {
  const [abierto, setAbierto] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setAbierto(false)
      }
    }
    document.addEventListener("mousedown", handleClickFuera)
    return () => document.removeEventListener("mousedown", handleClickFuera)
  }, [])

  const toggleValor = (value) => {
    const nuevos = seleccionados.includes(value)
      ? seleccionados.filter(v => v !== value)
      : [...seleccionados, value]
    onChange(nuevos)
  }

  const textoTrigger = seleccionados.length === 0
    ? placeholder
    : seleccionados.length <= 2
      ? seleccionados.join(", ")
      : `${seleccionados.length} seleccionadas`

  return (
    <div className="reportes-multiselect-wrapper" ref={wrapperRef}>
      <button
        type="button"
        className="reportes-multiselect-trigger"
        onClick={() => setAbierto(prev => !prev)}
      >
        <span className={seleccionados.length === 0 ? "reportes-multiselect-placeholder" : ""}>
          {textoTrigger}
        </span>
        <ChevronDown size={14} />
      </button>

      {abierto && (
        <div className="reportes-multiselect-panel">
          {options.map(op => {
            const value = typeof op === "object" ? op.value : op
            const label = typeof op === "object" ? op.label : op
            const marcado = seleccionados.includes(value)
            return (
              <label key={value} className="reportes-multiselect-item">
                <input type="checkbox" checked={marcado} onChange={() => toggleValor(value)} />
                {label}
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}