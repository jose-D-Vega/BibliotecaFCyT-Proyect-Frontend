import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { FILTROS_META } from "../constants/filtrosMeta"
import { formatearCelda } from "./formatearCelda"

export const exportarReportePDF = (reporte, entidadLabel, entidadKey) => {
  const cantidadColumnas = reporte.data.columnas.length
  const orientacion = cantidadColumnas > 8 ? "landscape" : "portrait"
  const formato = cantidadColumnas > 15 ? "a3" : "a4"
  const fontSize = cantidadColumnas > 15 ? 6 : cantidadColumnas > 8 ? 7 : 8

  const doc = new jsPDF({ orientation: orientacion, unit: "mm", format: formato })

  doc.setFontSize(14)
  doc.text(`Reporte: ${entidadLabel}`, 14, 15)

  doc.setFontSize(9)
  doc.setTextColor(100)
  doc.text(`Generado el ${new Date(reporte.metadata.fecha_generado).toLocaleString("es-PY")}`, 14, 21)

  const filtrosTexto = Object.entries(reporte.metadata.filtros_aplicados || {})
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${FILTROS_META[k]?.label || k}: ${Array.isArray(v) ? v.join(", ") : v}`)
    .join("  |  ")
  if (filtrosTexto) doc.text(`Filtros: ${filtrosTexto}`, 14, 26)

  // Tope de ancho (~400px ≈ 100mm) solo para columnas de texto largo, para que
  // "observaciones"/"descripcion_sancion" no infle el resto de la tabla.
  const columnStyles = {}
  reporte.data.columnas.forEach((c, idx) => {
    if (/observ|descripcion/i.test(c.key)) {
      columnStyles[idx] = { cellWidth: 100 }
    }
  })

  autoTable(doc, {
    startY: filtrosTexto ? 31 : 26,
    head: [reporte.data.columnas.map(c => c.label)],
    body: reporte.data.filas.map(fila =>
      reporte.data.columnas.map(c => formatearCelda(fila[c.key], c.key))
    ),
    styles: { fontSize, cellPadding: 2, overflow: "linebreak" },
    columnStyles,
    headStyles: { fillColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    horizontalPageBreak: true,
    horizontalPageBreakRepeat: 0,
    horizontalPageBreakBehaviour: "immediate"
  })

  doc.save(`reporte_${entidadKey}_${Date.now()}.pdf`)
}