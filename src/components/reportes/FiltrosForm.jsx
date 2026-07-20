import React from "react"
import { FILTROS_META, FECHA_LABEL_POR_ENTIDAD } from "../../constants/filtrosMeta"
import BuscadorUsuarioFiltro from "./BuscadorUsuarioFiltro"
import BuscadorLibroFiltro from "./BuscadorLibroFiltro"
import MultiSelectDropdown from "./MultiSelectDropdown"
import { bloquearCaracteresNumero, sanitizarPegadoNumero } from "../../utils/bloquearCaracteresNumero"
import { validarCambioFecha } from "../../utils/validarRangoFecha"

export default function FiltrosForm({
  filtrosDisponibles, filtros, onFiltroChange,
  usuariosInfo, onSeleccionarUsuario, onQuitarUsuario,
  librosInfo, onSeleccionarLibro, onQuitarLibro, entidadKey, resetKey
}) {
  return (
    <div className="reportes-seccion">
      <h3>Filtros</h3>
      <div className="reportes-filtros-grid">
        {filtrosDisponibles.map(filtroKey => {
          const meta = FILTROS_META[filtroKey] || { label: filtroKey, type: "text" }
          const label = FECHA_LABEL_POR_ENTIDAD[entidadKey]?.[filtroKey] || meta.label
          return (
            <div className="reportes-filtro-item" key={filtroKey}>
              <label>{label}</label>
              {meta.type === "usuario_search" ? (
                <BuscadorUsuarioFiltro
                  key={`${filtroKey}-${resetKey}`}
                  usuarioSeleccionado={usuariosInfo[filtroKey] || null}
                  onSeleccionar={(usuario) => onSeleccionarUsuario(filtroKey, usuario)}
                  onQuitar={() => onQuitarUsuario(filtroKey)}
                  soloStaff={meta.soloStaff}
                />
              ) : meta.type === "libro_search" ? (
                <BuscadorLibroFiltro
                  key={`${filtroKey}-${resetKey}`}
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
                  max={filtroKey === "fecha_desde" ? (filtros.fecha_hasta || new Date().toISOString().split("T")[0]) : undefined}
                  min={filtroKey === "fecha_hasta" ? (filtros.fecha_desde || undefined) : undefined}
                  onChange={(e) => {
                    const esFechaValidable = filtroKey === "fecha_desde" || filtroKey === "fecha_hasta"
                    const valor = esFechaValidable ? validarCambioFecha(filtroKey, e.target.value, filtros) : e.target.value
                    onFiltroChange(filtroKey, valor)
                  }}
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