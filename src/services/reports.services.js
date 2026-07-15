import api from './api'

// Devuelve las entidades reportables disponibles (con sus columnas y filtros)
// para armar dinámicamente los botones de la página de reportes.
export const getReportesConfig = async () => {
  const { data } = await api.get('/reports/config')
  return data.entidades
}

// Genera un reporte para una entidad puntual, con las columnas y filtros elegidos.
// columnas: array de keys (ej: ['usuario', 'estado_prestamo'])
// filtros: objeto plano (ej: { estado_prestamo: 'activo', fecha_desde: '2026-01-01' })
export const generarReporte = async (entidad, columnas, filtros) => {
  const params = new URLSearchParams()
  params.append('entidad', entidad)
  if (columnas && columnas.length > 0) {
    params.append('columnas', columnas.join(','))
  }
  Object.entries(filtros || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value)
    }
  })

  const { data } = await api.get(`/reports/generar?${params.toString()}`)
  return data
}