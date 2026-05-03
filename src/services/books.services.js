import api from './api'

export const getBooks = async ({ search, tipo_material, carrera, page, limit }) => {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (tipo_material) params.append('tipo_material', tipo_material)
  if (carrera) params.append('carrera', carrera)
  if (page) params.append('page', page)
  if (limit) params.append('limit', limit)

  const { data } = await api.get(`/books?${params.toString()}`)
  return data
}

export const getBookById = async (id) => {
  const { data } = await api.get(`/books/${id}`)
  return data.data
}

export const getCopiesByBook = async (id_libro) => {
  const { data } = await api.get(`/books/${id_libro}/copies`)
  return data.data
}