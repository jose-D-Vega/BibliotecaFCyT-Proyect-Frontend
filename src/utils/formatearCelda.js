// Convierte cualquier valor de celda a texto legible para la tabla/PDF
export const formatearCelda = (valor) => {
  if (valor === null || valor === undefined) return "-"
  if (typeof valor === "boolean") return valor ? "Sí" : "No"
  if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}/.test(valor)) {
    const fecha = new Date(valor)
    return isNaN(fecha) ? valor : fecha.toLocaleDateString("es-PY")
  }
  return String(valor)
}