import api from './api'

export const getSanctions = async ({ id_usuario, estado, tipo_infraccion, page, limit }) => {
  const params = new URLSearchParams()
  if (id_usuario) params.append('id_usuario', id_usuario)
  if (estado) params.append('estado', estado)
  if (tipo_infraccion) params.append('tipo_infraccion', tipo_infraccion)
  if (page) params.append('page', page)
  if (limit) params.append('limit', limit)
  const { data } = await api.get(`/sanctions?${params.toString()}`)
  return data
}

export const getSanction = async (id) => {
  const { data } = await api.get(`/sanctions/${id}`)
  return data.data
}

export const createSanction = async (sancionData) => {
  const { data } = await api.post('/sanctions', sancionData)
  return data
}

export const resolveSanction = async (id) => {
  const { data } = await api.patch(`/sanctions/${id}/resolver`)
  return data
}

export const escalateSanction = async (id) => {
  const { data } = await api.patch(`/sanctions/${id}/escalar`)
  return data
}

export const getMySanctions = async () => {
  const { data } = await api.get('/sanctions/mis-sanciones')
  return data.data
}

export const confirmSanction = async (id) => {
  const { data } = await api.patch(`/sanctions/${id}/confirmar`)
  return data
}

export const rejectSanction = async (id) => {
  const { data } = await api.patch(`/sanctions/${id}/rechazar`)
  return data
}

export const getSanctionsGrouped = async ({ estado, page, limit }) => {
  const params = new URLSearchParams()
  if (estado) params.append('estado', estado)
  if (page) params.append('page', page)
  if (limit) params.append('limit', limit)
  const { data } = await api.get(`/sanctions/agrupadas?${params.toString()}`)
  return data
}

export const getSanctionsByLoan = async (id_prestamo, estado) => {
  const { data } = await api.get(`/sanctions/prestamo/${id_prestamo}`, {
    params: { estado }
  })
  return data.data
}

// Buscar préstamos a sancionar por nombre, correo o ci del usuario
export const searchSanctionableLoans = async (search, tipo) => {
  const params = new URLSearchParams({ search, tipo })
  const { data } = await api.get(`/sanctions/buscar-prestamo?${params.toString()}`)
  return data.data
}

// Obtener un préstamo con sus ejemplares — para elegir cuáles sancionar
export const getLoanForSanction = async (id_prestamo, tipo_infraccion = null) => {
  const { data } = await api.get(`/sanctions/prestamo/${id_prestamo}/ejemplares`, {
    params: tipo_infraccion ? { tipo_infraccion } : {}
  })
  return data.data
}

// Sanciones de comportamiento agrupadas por usuario
export const getSancionesComportamientoAgrupadas = async ({ estado, page, limit }) => {
  const params = new URLSearchParams()
  if (estado) params.append('estado', estado)
  if (page)   params.append('page', page)
  if (limit)  params.append('limit', limit)
  const { data } = await api.get(`/sanctions/comportamiento?${params.toString()}`)
  return data
}

// Todas las sanciones de comportamiento de un usuario — para el modal de detalle
export const getSancionesComportamientoByUsuario = async (id_usuario, estado) => {
  const { data } = await api.get(`/sanctions/comportamiento/usuario/${id_usuario}`, {
    params: { estado }
  })
  return data.data
}

export const desescalateSanction = async (id) => {
  const { data } = await api.patch(`/sanctions/${id}/desescalar`)
  return data
}

export const getAllSanctionsByLoan = async (id_prestamo) => {
  const { data } = await api.get(`/sanctions/prestamo/${id_prestamo}/todas`)
  return data.data
}

export const getAllSancionesComportamientoByUsuario = async (id_usuario) => {
  const { data } = await api.get(`/sanctions/comportamiento/usuario/${id_usuario}/todas`)
  return data.data
}

export const editSanction = async (id, payload) => {
  const { data } = await api.patch(`/sanctions/${id}/editar`, payload)
  return data.data
}