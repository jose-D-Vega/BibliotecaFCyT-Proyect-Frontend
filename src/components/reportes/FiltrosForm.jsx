import React from "react"
import { FILTROS_META } from "../../constants/filtrosMeta"
import BuscadorUsuarioFiltro from "./BuscadorUsuarioFiltro"
import BuscadorLibroFiltro from "./BuscadorLibroFiltro"
import MultiSelectDropdown from "./MultiSelectDropdown"
import { bloquearCaracteresNumero, sanitizarPegadoNumero } from "../../utils/bloquearCaracteresNumero"

export default function FiltrosForm({
  filtrosDisponibles, filtros, onFiltroChange,
  usuariosInfo, onSeleccionarUsuario, onQuitarUsuario,
  librosInfo, onSeleccionarLibro, onQuitarLibro
}) {
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
              ) : meta.type === "libro_search" ? (
                <BuscadorLibroFiltro
                  libroSeleccionado={librosInfo[filtroKey] || null}
                  onSeleccionar={(libro) => onSeleccionarLibro(filtroKey, libro)}
                  onQuitar={() => onQuitarLibro(filtroKey)}
                />
              ) : meta.type === "multi-select" ? (
                <MultiSelectDropdown
                  options={meta.options}
                  seleccionados={Array.isArray(filtros[filtroKey]) ? filtros[filtroKey] : []}
                  onChange={(nuevos) => onFiltroChange(filtroKey, nuevos)}
                />
              ) : meta.type === "select" ? (
                <select value={filtros[filtroKey] || ""} onChange={(e) => onFiltroChange(filtroKey, e.target.value)}>
                  <option value="">Todos</option>
                  {meta.options.map(op => {
                    const value = typeof op === "object" ? op.value : op
                    const label = typeof op === "object" ? op.label : op
                    return <option key={value} value={value}>{label}</option>
                  })}
                </select>
              ) : (
                <input
                  type={meta.type}
                  value={filtros[filtroKey] || ""}
                  onChange={(e) => onFiltroChange(filtroKey, e.target.value)}
                  onKeyDown={meta.type === "number" ? bloquearCaracteresNumero : undefined}
                  onPaste={meta.type === "number" ? (e) => sanitizarPegadoNumero(e, onFiltroChange, filtroKey) : undefined}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}