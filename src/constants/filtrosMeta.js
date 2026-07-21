// Metadata local de cómo renderizar cada filtro conocido. Si el backend agrega un filtro
// nuevo que no está acá, FiltrosForm cae al default: input de texto libre.
export const FILTROS_META = {
  estado_ejemplar: {
    label: "Estado del ejemplar",
    type: "multi-select",
    options: [
      { value: "disponible", label: "Disponible" },
      { value: "prestado", label: "Prestado" },
      { value: "reservado", label: "Reservado" },
      { value: "eliminado", label: "Eliminado" },
      { value: "inhabilitado", label: "Inhabilitado" },
      { value: "deteriorado", label: "Deteriorado" },
      { value: "perdido", label: "Perdido" },
      { value: "solicitado", label: "Solicitado" }
    ]
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
    label: "Estado del préstamo",
    type: "multi-select",
    options: [
      { value: "solicitado", label: "Solicitado" },
      { value: "aprobado", label: "Aprobado" },
      { value: "parcialmente_aprobado", label: "Parcialmente Aprobado" },
      { value: "rechazado", label: "Rechazado" },
      { value: "cancelado", label: "Cancelado" },
      { value: "activo", label: "Activo" },
      { value: "devuelto", label: "Devuelto" },
      { value: "vencido", label: "Vencido" },
      { value: "pendiente_devolucion", label: "Pendiente de Devolución" },
      { value: "solicitud_renovacion", label: "Solicitud de Renovación" },
      { value: "renovado", label: "Renovado" },
      { value: "renovacion_finalizada", label: "Renovación Finalizada" },
      { value: "cerrado_con_perdida", label: "Cerrado con Pérdida" },
      { value: "solicitud_reserva", label: "Solicitud de Reserva" },
      { value: "reserva_aprobada", label: "Reserva Aprobada" },
      { value: "reserva_parcialmente_aprobada", label: "Reserva Parcialmente Aprobada" },
      { value: "reserva_rechazada", label: "Reserva Rechazada" }
    ]
  },
  id_bibliotecario: { label: "Bibliotecario (respondió)", type: "usuario_search", soloStaff: true },
  id_bibliotecario_activacion: { label: "Bibliotecario (activó)", type: "usuario_search", soloStaff: true },
  estado_prestamo_ejemplar: {
    label: "Estado del ítem",
    type: "multi-select",
    options: [
      { value: "solicitado", label: "Solicitado" },
      { value: "aprobado", label: "Aprobado" },
      { value: "rechazado", label: "Rechazado" },
      { value: "activo", label: "Activo" },
      { value: "devuelto", label: "Devuelto" },
      { value: "cancelado", label: "Cancelado" },
      { value: "perdido", label: "Perdido" },
      { value: "reemplazado", label: "Reemplazado" }
    ]
  },

  id_bibliotecario_devolucion: { label: "Recibido por (devolución)", type: "usuario_search", soloStaff: true },

  estado_devuelto: {
    label: "Estado al devolver",
    type: "multi-select",
    options: [
      { value: "bueno", label: "Bueno" },
      { value: "deteriorado", label: "Deteriorado" },
      { value: "danado", label: "Dañado" }
    ]
  },

  estado_sancion: {
    label: "Estado de la sanción",
    type: "multi-select",
    options: [
      { value: "pendiente_confirmacion", label: "Pendiente de Confirmación" },
      { value: "activa", label: "Activa" },
      { value: "rechazada", label: "Rechazada" },
      { value: "resuelta", label: "Resuelta" },
      { value: "escalada", label: "Escalada" }
    ]
  },

  tipo_infraccion: {
    label: "Tipo de infracción",
    type: "multi-select",
    options: [
      { value: "falta_entrega", label: "Falta de Entrega" },
      { value: "devolucion_tardia", label: "Devolución Tardía" },
      { value: "deterioro", label: "Deterioro" },
      { value: "perdida", label: "Pérdida" },
      { value: "comportamiento", label: "Comportamiento" }
    ]
  },

  id_admin: { label: "Registrado por (sanción)", type: "usuario_search", soloStaff: true },
  
  es_reserva: { label: "¿Es reserva?", type: "select", options: ["true", "false"] },
  activo: { label: "Activo", type: "select", options: [
    { value: "true", label: "Sí" },
    { value: "false", label: "No" }
  ] },
  fecha_desde: { label: "Desde", type: "date" },
  fecha_hasta: { label: "Hasta", type: "date" },
  rol: {
    label: "Rol",
    type: "multi-select",
    options: [
      { value: "admin", label: "Admin" },
      { value: "bibliotecario", label: "Bibliotecario" },
      { value: "normal", label: "Normal" }
    ]
  },
}

// fecha_desde/fecha_hasta es una clave global reutilizada por varias entidades,
// pero cada una filtra un campo distinto — este mapa da contexto sin duplicar
// la definición del filtro en cada entidad.
export const FECHA_LABEL_POR_ENTIDAD = {
  prestamos:          { fecha_desde: "Solicitado desde", fecha_hasta: "Solicitado hasta" },
  detalles_prestamos: { fecha_desde: "Solicitado desde", fecha_hasta: "Solicitado hasta" },
  devoluciones:       { fecha_desde: "Devuelto desde", fecha_hasta: "Devuelto hasta" },
  sanciones:          { fecha_desde: "Sancionado desde", fecha_hasta: "Sancionado hasta" }
}