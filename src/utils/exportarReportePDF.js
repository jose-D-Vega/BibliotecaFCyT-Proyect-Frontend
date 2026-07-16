import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { FILTROS_META } from "../constants/filtrosMeta"
import { formatearCelda } from "./formatearCelda"

export const exportarReportePDF = (reporte, entidadLabel, entidadKey) => {
  const doc = new jsPDF()

  doc.setFontSize(14)
  doc.text(`Reporte: ${entidadLabel}`, 14, 15)

  doc.setFontSize(9)
  doc.setTextColor(100)
  doc.text(`Generado el ${new Date(reporte.metadata.fecha_generado).toLocaleString("es-PY")}`, 14, 21)

  const filtrosTexto = Object.entries(reporte.metadata.filtros_aplicados || {})
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${FILTROS_META[k]?.label || k}: ${v}`)
    .join("  |  ")
  if (filtrosTexto) doc.text(`Filtros: ${filtrosTexto}`, 14, 26)

  autoTable(doc, {
    startY: filtrosTexto ? 31 : 26,
    head: [reporte.data.columnas.map(c => c.label)],
    body: reporte.data.filas.map(fila =>
      reporte.data.columnas.map(c => formatearCelda(fila[c.key]))
    ),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  })

  doc.save(`reporte_${entidadKey}_${Date.now()}.pdf`)
}