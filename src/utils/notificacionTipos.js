// Catálogo central de tipos de notificación: ícono, etiqueta y a qué rol corresponde.
// Lo usan NotificacionesBadge, NotificacionesPage y NotificacionesFilters
// para no mantener el mismo mapeo duplicado en 3 archivos.

export const NOTIFICACION_TIPOS = {
  // --- Préstamos ---
  prestamo_aprobado:    { icono: '✅', label: 'Préstamo aprobado',              rol: 'usuario' },
  prestamo_parcial:     { icono: '🟡', label: 'Préstamo parcialmente aprobado', rol: 'usuario' },
  prestamo_rechazado:   { icono: '❌', label: 'Préstamo rechazado',             rol: 'usuario' },
  prestamo_activado:    { icono: '📖', label: 'Préstamo activado',              rol: 'usuario' },
  prestamo_por_vencer:  { icono: '⚠️', label: 'Préstamo por vencer',            rol: 'usuario' },
  prestamo_devuelto:    { icono: '📚', label: 'Préstamo devuelto',              rol: 'usuario' },
  prestamo_vencido:     { icono: '🔴', label: 'Préstamo vencido',               rol: 'ambos' },
  pendiente_devolucion: { icono: '📕', label: 'Pendiente de devolución',        rol: 'usuario' },

  // --- Reservas ---
  reserva_aprobada:   { icono: '✅', label: 'Reserva aprobada',              rol: 'usuario' },
  reserva_parcial:    { icono: '🟡', label: 'Reserva parcialmente aprobada', rol: 'usuario' },
  reserva_rechazada:  { icono: '❌', label: 'Reserva rechazada',             rol: 'usuario' },
  reserva_disponible: { icono: '🔔', label: 'Reserva disponible',            rol: 'usuario' },
  reserva_modificada: { icono: '🔄', label: 'Reserva modificada',            rol: 'usuario' },

  // --- Renovaciones ---
  renovacion_aprobada:  { icono: '✅', label: 'Renovación aprobada',  rol: 'usuario' },
  renovacion_rechazada: { icono: '❌', label: 'Renovación rechazada', rol: 'usuario' },
  renovacion_vencida:   { icono: '⏰', label: 'Renovación vencida',  rol: 'usuario' },

  // --- Sanciones ---
  sancion_recibida:  { icono: '🚫', label: 'Sanción recibida',  rol: 'usuario' },
  sancion_resuelta:  { icono: '✔️', label: 'Sanción resuelta',  rol: 'usuario' },
  cuenta_habilitada: { icono: '🔓', label: 'Cuenta habilitada', rol: 'usuario' },

  // --- Solo admin ---
  admin_renovacion_pendiente: { icono: '🔁', label: 'Renovación pendiente',          rol: 'admin' },
  admin_sancion_escalada:     { icono: '📛', label: 'Sanción sin resolver (30 días)', rol: 'admin' },
  admin_reserva_lista:        { icono: '📦', label: 'Reserva lista para gestionar',   rol: 'admin' }
}

export const getIconoTipo = (tipo) => NOTIFICACION_TIPOS[tipo]?.icono || '🔔'
export const getLabelTipo = (tipo) => NOTIFICACION_TIPOS[tipo]?.label || tipo

// Devuelve solo los tipos relevantes para el rol activo (los "admin" no le sirven
// a un usuario normal en el filtro, y viceversa; 'ambos' aparece para los dos)
export const getTiposPorRol = (rolActivo) => {
  const claveRol = rolActivo === 'admin' ? 'admin' : 'usuario'
  return Object.entries(NOTIFICACION_TIPOS)
    .filter(([, info]) => info.rol === 'ambos' || info.rol === claveRol)
    .map(([tipo]) => tipo)
}