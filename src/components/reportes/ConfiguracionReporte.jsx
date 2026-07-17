import React from "react"
import { ArrowLeft, Loader2, Check, Eraser } from "lucide-react"
import ExtensionesSelector from "./ExtensionesSelector"
import ColumnasSelector from "./ColumnasSelector"
import FiltrosForm from "./FiltrosForm"
import OrdenSelector from "./OrdenSelector"

export default function ConfiguracionReporte({
  entidadActual,
  extensionesActivas,
  columnasDisponibles,
  columnasSeleccionadas,
  filtrosDisponibles,
  filtros,
  usuariosInfo,
  librosInfo,
  orden,
  generando,
  onToggleExtension,
  onToggleColumna,
  onSeleccionarTodas,
  onDeseleccionarTodas,
  onFiltroChange,
  onSeleccionarUsuario,
  onQuitarUsuario,
  onSeleccionarLibro,
  onQuitarLibro,
  onOrdenChange,
  onGenerar,
  onCambiarTipo,
  onLimpiarTodo
}) {
  return (
    <div className="reportes-config no-print">
      <div className="reportes-config-header">
        <button className="reportes-btn-volver" onClick={onCambiarTipo}>
          <ArrowLeft size={16} /> Cambiar tipo de reporte
        </button>
        <button className="reportes-btn-limpiar" onClick={onLimpiarTodo}>
          <Eraser size={16} /> Limpiar todo
        </button>
      </div>

      <h2 className="reportes-subtitulo">{entidadActual.label}</h2>

      <ExtensionesSelector
        extensiones={entidadActual.extensiones}
        extensionesActivas={extensionesActivas}
        onToggle={onToggleExtension}
      />

      <ColumnasSelector
        columnasDisponibles={columnasDisponibles}
        columnasSeleccionadas={columnasSeleccionadas}
        onToggle={onToggleColumna}
        onSeleccionarTodas={onSeleccionarTodas}
        onDeseleccionarTodas={onDeseleccionarTodas}
      />

      <FiltrosForm
        filtrosDisponibles={filtrosDisponibles}
        filtros={filtros}
        onFiltroChange={onFiltroChange}
        usuariosInfo={usuariosInfo}
        onSeleccionarUsuario={onSeleccionarUsuario}
        onQuitarUsuario={onQuitarUsuario}
        librosInfo={librosInfo}
        onSeleccionarLibro={onSeleccionarLibro}
        onQuitarLibro={onQuitarLibro}
      />


      <OrdenSelector
        columnasDisponibles={columnasDisponibles}
        orden={orden}
        onChange={onOrdenChange}
      />

      <button className="reportes-btn-generar" onClick={onGenerar} disabled={generando}>
        {generando ? <Loader2 className="spin" size={16} /> : <Check size={16} />}
        {generando ? "Generando..." : "Generar reporte"}
      </button>
    </div>
  )
}