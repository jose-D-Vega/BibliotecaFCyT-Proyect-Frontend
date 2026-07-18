// Valida un cambio en los filtros de fecha "desde"/"hasta": evita que "desde"
// sea una fecha futura, y evita que ambos queden invertidos entre sí (desde > hasta
// o hasta < desde). Si el cambio no es válido, devuelve el valor anterior (lo ignora)
// en vez de dejar pasar una fecha sin sentido.
export const validarCambioFecha = (filtroKey, nuevoValor, filtros) => {
  if (!nuevoValor) return nuevoValor // permitir vaciar el campo libremente

  const hoy = new Date().toISOString().split("T")[0]

  if (filtroKey === "fecha_desde") {
    if (nuevoValor > hoy) return filtros.fecha_desde || ""
    if (filtros.fecha_hasta && nuevoValor > filtros.fecha_hasta) return filtros.fecha_desde || ""
  }

  if (filtroKey === "fecha_hasta") {
    if (filtros.fecha_desde && nuevoValor < filtros.fecha_desde) return filtros.fecha_hasta || ""
  }

  return nuevoValor
}