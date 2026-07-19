// Funciones de formateo de texto reutilizadas en varios componentes del módulo
// de préstamos (tarjetas, modales de detalle, badges). Centralizadas acá para
// no tener la misma lógica copiada en 6 archivos distintos.

// "juan perez" -> "Juan Perez"
export function capitalizeWords(text) {
  return (text || "")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

// "parcialmente_aprobado" -> "Parcialmente Aprobado"
export function formatEstado(text) {
  return (text || "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase())
}