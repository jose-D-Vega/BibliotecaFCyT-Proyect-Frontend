import React from "react"
import { FILTROS_META } from "../../constants/filtrosMeta"
import BuscadorUsuarioFiltro from "./BuscadorUsuarioFiltro"

export default function FiltrosForm({ filtrosDisponibles, filtros, onFiltroChange, usuariosInfo, onSeleccionarUsuario, onQuitarUsuario }) {
  return (
    <div className="reportes-seccion">
      <h3>Filtros</h3>
      <div className="reportes-filtros-grid">
        {filtrosDisponibles.map(filtroKey => {
          const meta = FILTROS_META[filtroKey] || { label: filtroKey, type: "text" }
          return (
            <div className="reportes-filtro-item" key={filtroKey}>
              <label>{meta.label}</label>
              {meta.type === "usuario_search" ? (
                <BuscadorUsuarioFiltro
                  usuarioSeleccionado={usuariosInfo[filtroKey] || null}
                  onSeleccionar={(usuario) => onSeleccionarUsuario(filtroKey, usuario)}
                  onQuitar={() => onQuitarUsuario(filtroKey)}
                />
              ) : meta.type === "select" ? (
                <select value={filtros[filtroKey] || ""} onChange={(e) => onFiltroChange(filtroKey, e.target.value)}>
                  <option value="">Todos</option>
                  {meta.options.map(op => <option key={op} value={op}>{op}</option>)}
                </select>
              ) : (
                <input
                  type={meta.type}
                  value={filtros[filtroKey] || ""}
                  onChange={(e) => onFiltroChange(filtroKey, e.target.value)}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}