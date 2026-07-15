import api from './api'

export const getReportesConfig = async () => {
  const { data } = await api.get('/reports/config')
  return data.entidades
}

export const generarReporte = async (entidad, columnas, filtros, extensiones = [], orden = null) => {
  const params = new URLSearchParams()
  params.append('entidad', entidad)
  if (columnas && columnas.length > 0) params.append('columnas', columnas.join(','))
  if (extensiones.length > 0) params.append('extensiones', extensiones.join(','))
  if (orden?.columna) {
    params.append('orden_por', orden.columna)
    params.append('orden_dir', orden.direccion || 'ASC')
  }
  Object.entries(filtros || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value)
    }
  })

  const { data } = await api.get(`/reports/generar?${params.toString()}`)
  return data
}

export const buscarUsuarios = async (q) => {
  const { data } = await api.get(`/reports/buscar-usuario?q=${encodeURIComponent(q)}`)
  return data.data
}