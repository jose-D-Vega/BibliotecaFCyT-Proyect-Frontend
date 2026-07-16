import React from "react"

export default function ExtensionesSelector({ extensiones, extensionesActivas, onToggle }) {
  if (!extensiones || extensiones.length === 0) return null

  return (
    <div className="reportes-seccion">
      <h3>Combinar con</h3>
      <div className="reportes-checkbox-grupo">
        {extensiones.map(ext => (
          <label key={ext.key} className="reportes-checkbox-item">
            <input
              type="checkbox"
              checked={extensionesActivas.includes(ext.key)}
              onChange={() => onToggle(ext)}
            />
            {ext.label}
          </label>
        ))}
      </div>
    </div>
  )
}