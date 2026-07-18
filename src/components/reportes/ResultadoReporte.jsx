import React from "react"
import { Printer, Download, ArrowLeft, Eraser } from "lucide-react"
import { formatearCelda } from "../../utils/formatearCelda"

export default function ResultadoReporte({ reporte, entidadLabel, onEditarFiltros, onLimpiarTodo, onImprimir, onExportarPDF }) {
  return (
    <div className="reportes-resultado">
      <div className="reportes-resultado-header no-print">
        <button className="reportes-btn-volver" onClick={onEditarFiltros}>
          <ArrowLeft size={16} /> Editar filtros
        </button>
        <div className="reportes-acciones">
          <button className="reportes-btn-accion" onClick={onImprimir}>
            <Printer size={16} /> Imprimir
          </button>
          <button className="reportes-btn-accion reportes-btn-pdf" onClick={onExportarPDF}>
            <Download size={16} /> Exportar PDF
          </button>
          <button className="reportes-btn-accion" onClick={onLimpiarTodo}>
            <Eraser size={16} /> Limpiar todo
          </button>
        </div>
      </div>

      <div className="reportes-imprimible">
        <h2>{entidadLabel}</h2>
        <p className="reportes-meta-info">
          Generado el {new Date(reporte.metadata.fecha_generado).toLocaleString("es-PY")}
          {" — "}{reporte.data.filas.length} resultado(s)
        </p>

        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>{reporte.data.columnas.map(col => <th key={col.key}>{col.label}</th>)}</tr>
            </thead>
            <tbody>
              {reporte.data.filas.length === 0 ? (
                <tr>
                  <td colSpan={reporte.data.columnas.length} className="sin-resultados">
                    No se encontraron resultados con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                reporte.data.filas.map((fila, i) => (
                  <tr key={i}>
                    {reporte.data.columnas.map(col => <td key={col.key}>{formatearCelda(fila[col.key], col.key)}</td>)}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}