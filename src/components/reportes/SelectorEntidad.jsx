import React from "react"
import { FileText } from "lucide-react"

export default function SelectorEntidad({ entidades, onElegir }) {
  return (
    <div className="reportes-entidades">
      {entidades.map(entidad => (
        <button key={entidad.key} className="reportes-entidad-card" onClick={() => onElegir(entidad)}>
          <FileText size={22} />
          <span>{entidad.label}</span>
        </button>
      ))}
    </div>
  )
}