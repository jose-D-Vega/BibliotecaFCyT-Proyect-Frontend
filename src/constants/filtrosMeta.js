// Metadata local de cómo renderizar cada filtro conocido. Si el backend agrega un filtro
// nuevo que no está acá, FiltrosForm cae al default: input de texto libre.
export const FILTROS_META = {
  estado_ejemplar: {
    label: "Estado del ejemplar", type: "select",
    options: ["disponible", "prestado", "reservado", "eliminado", "inhabilitado", "deteriorado", "perdido", "solicitado"]
  },
  tipo_material: {
    label: "Tipo de material", type: "select",
    options: [
      { value: "libro", label: "Libro" },
      { value: "tfg", label: "TFG" }
    ]
  },
  carrera: {
    label: "Carrera", type: "multi-select",
    options: ["General", "Informática", "Electrónica", "Electricidad", "Civil"]
  },
  facultad: { label: "Facultad", type: "text" },
  id_libro: { label: "Libro", type: "libro_search" },
  anio_desde: { label: "Año desde", type: "number" },
  anio_hasta: { label: "Año hasta", type: "number" },
  id_usuario: { label: "Usuario", type: "usuario_search" },
  id_prestamo: { label: "N° de préstamo", type: "number" },
  estado_prestamo: {
    label: "Estado del préstamo", type: "select",
    options: ["solicitado", "aprobado", "parcialmente_aprobado", "rechazado", "cancelado", "activo", "devuelto",
      "vencido", "pendiente_devolucion", "solicitud_renovacion", "renovado", "renovacion_finalizada",
      "cerrado_con_perdida", "solicitud_reserva", "reserva_aprobada", "reserva_parcialmente_aprobada", "reserva_rechazada"]
  },
  estado_prestamo_ejemplar: {
    label: "Estado del ítem", type: "select",
    options: ["solicitado", "aprobado", "rechazado", "activo", "devuelto", "cancelado", "perdido", "reemplazado"]
  },
  estado_devuelto: { label: "Estado al devolver", type: "select", options: ["bueno", "deteriorado", "danado"] },
  es_reserva: { label: "¿Es reserva?", type: "select", options: ["true", "false"] },
  fecha_desde: { label: "Desde", type: "date" },
  fecha_hasta: { label: "Hasta", type: "date" },
  tipo_infraccion: {
    label: "Tipo de infracción", type: "select",
    options: ["falta_entrega", "devolucion_tardia", "deterioro", "perdida", "comportamiento"]
  },
  estado_sancion: {
    label: "Estado de la sanción", type: "select",
    options: ["pendiente_confirmacion", "activa", "rechazada", "resuelta", "escalada"]
  },
  rol: { label: "Rol", type: "select", options: ["admin", "bibliotecario", "normal"] },
  activo: { label: "¿Activo?", type: "select", options: ["true", "false"] },
  sancionado: { label: "¿Sancionado?", type: "select", options: ["true", "false"] }
}