import { useState } from "react"
import "../components/styles/Filtros.css"

function Filtros({
  areas,
  setAreas,
  tipo,
  setTipo,
  orden,
  setOrden,
  resetFiltros,
  todosActivos
}) {

  const [open, setOpen] = useState(null)

  const toggle = (menu) => {
    setOpen(open === menu ? null : menu)
  }

  const handleReset = () => {
    resetFiltros()
    setOpen(null)
  }

  const toggleArea = (value) => {
    if (value === "General") {
      setAreas(areas.includes("General") ? [] : ["General"])
      return
    }

    let updated = [...areas]
    updated = updated.filter(a => a !== "General")

    if (updated.includes(value)) {
      updated = updated.filter(a => a !== value)
    } else {
      updated.push(value)
    }

    setAreas(updated)
  }

  const toggleTipo = (value) => {
    setTipo(tipo === value ? "" : value)
  }

  const getOrdenLabel = () => {
    switch (orden) {
      case "AZ": return "A-Z"
      case "ZA": return "Z-A"
      case "EJ_DESC": return "Ejemplares Disponibles (Mayor a Menor)"
      case "EJ_ASC": return "Ejemplares Disponibles (Menor a Mayor)"
      default: return "A-Z"
    }
  }

  return (
    <div className="filtros">

      <button
        className={`filter-btn todos-btn ${todosActivos ? "active" : ""}`}
        onClick={handleReset}
      >
        Todos
      </button>

      {/* ÁREA */}
      <div className="filtro-dropdown">
        <button onClick={() => toggle("area")} className="filter-btn">
          Área
          <span className={`arrow ${open === "area" ? "open" : ""}`}>▼</span>
          {areas.length > 0 && (
            <span className="selected">{areas.join(", ")}</span>
          )}
        </button>

        {open === "area" && (
          <div className="filtro-dropdown-menu">
            {["General", "Informática", "Electrónica", "Electricidad", "Civil"].map(opt => (
              <div
                key={opt}
                className={`option ${areas.includes(opt) ? "active" : ""}`}
                onClick={() => toggleArea(opt)}
              >
                {areas.includes(opt) && <span className="check">✔</span>}
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TIPO */}
      <div className="filtro-dropdown">
        <button onClick={() => toggle("tipo")} className="filter-btn">
          Tipo
          <span className={`arrow ${open === "tipo" ? "open" : ""}`}>▼</span>
          {tipo && <span className="selected">{tipo}</span>}
        </button>

        {open === "tipo" && (
          <div className="filtro-dropdown-menu">
            {["Libro", "TFG"].map(opt => (
              <div
                key={opt}
                className={`option ${tipo === opt ? "active" : ""}`}
                onClick={() => toggleTipo(opt)}
              >
                {tipo === opt && <span className="check">✔</span>}
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ORDEN */}
        <div className="filtro-dropdown filtro-dropdown-orden">
        <button onClick={() => toggle("orden")} className="filter-btn">
          Orden
          <span className={`arrow ${open === "orden" ? "open" : ""}`}>▼</span>
          <span className="selected">{getOrdenLabel()}</span>
        </button>

        {open === "orden" && (
          <div className="filtro-dropdown-menu">
            {[
              { label: "A-Z", value: "AZ" },
              { label: "Z-A", value: "ZA" },
              { label: "Ejemplares Disponibles (Mayor a Menor)", value: "EJ_DESC" },
              { label: "Ejemplares Disponibles (Menor a Mayor)", value: "EJ_ASC" }
            ].map(opt => (
              <div
                key={opt.value}
                className={`option ${orden === opt.value ? "active" : ""}`}
                onClick={() => setOrden(opt.value)}
              >
                {orden === opt.value && <span className="check">✔</span>}
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default Filtros