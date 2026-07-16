import React from "react"

export default function OrdenSelector({ columnasDisponibles, orden, onChange }) {
  return (
    <div className="reportes-seccion">
      <h3>Ordenar por</h3>
      <div className="reportes-orden-grupo">
        <select
          value={orden.columna}
          onChange={(e) => onChange({ ...orden, columna: e.target.value })}
        >
          <option value="">(orden por defecto)</option>
          {columnasDisponibles.map(col => (
            <option key={col.key} value={col.key}>{col.label}</option>
          ))}
        </select>
        <select
          value={orden.direccion}
          onChange={(e) => onChange({ ...orden, direccion: e.target.value })}
          disabled={!orden.columna}
        >
          <option value="ASC">Ascendente</option>
          <option value="DESC">Descendente</option>
        </select>
      </div>
    </div>
  )
}