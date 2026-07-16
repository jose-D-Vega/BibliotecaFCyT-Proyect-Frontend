import React from "react"

export default function ColumnasSelector({ columnasDisponibles, columnasSeleccionadas, onToggle, onSeleccionarTodas, onDeseleccionarTodas }) {
  return (
    <div className="reportes-seccion">
      <div className="reportes-seccion-titulo-con-acciones">
        <h3>Columnas a incluir ({columnasSeleccionadas.length} de {columnasDisponibles.length})</h3>
        <div className="reportes-seleccion-rapida">
          <button type="button" onClick={onSeleccionarTodas}>Todas</button>
          <button type="button" onClick={onDeseleccionarTodas}>Ninguna</button>
        </div>
      </div>
      <p className="reportes-hint">Tildá las columnas que querés ver en el reporte final.</p>
      <div className="reportes-checkbox-grupo">
        {columnasDisponibles.map(col => (
          <label key={col.key} className="reportes-checkbox-item">
            <input
              type="checkbox"
              checked={columnasSeleccionadas.includes(col.key)}
              onChange={() => onToggle(col.key)}
            />
            {col.label}
          </label>
        ))}
      </div>
    </div>
  )
}