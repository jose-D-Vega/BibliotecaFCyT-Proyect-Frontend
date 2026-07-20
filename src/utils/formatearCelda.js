import { FILTROS_META } from "../constants/filtrosMeta"

// Convierte cualquier valor de celda a texto legible para la tabla/PDF.
// Recibe también la clave de columna (columnKey) para poder buscar si esa
// columna corresponde a un filtro con opciones {value, label} (estados, tipo
// de infracción, etc.) y mostrar el label en lenguaje natural en vez del
// valor crudo (snake_case) guardado en la base.
export const formatearCelda = (valor, columnKey) => {
  if (valor === null || valor === undefined || valor === "") return "-"
  if (typeof valor === "boolean") return valor ? "Sí" : "No"

  if (columnKey) {
    const meta = FILTROS_META[columnKey]
    if (meta?.options) {
      const opcion = meta.options.find(op => (typeof op === "object" ? op.value : op) === valor)
      if (opcion && typeof opcion === "object") return opcion.label
    }
  }

  if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}/.test(valor)) {
    const fecha = new Date(valor)
    return isNaN(fecha) ? valor : fecha.toLocaleDateString("es-PY")
  }
  return String(valor)
}