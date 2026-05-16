import api from './api'

export const getBooks = async ({ search, tipo_material, carrera, page, limit, orden }) => {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (tipo_material) params.append('tipo_material', tipo_material)
  if (carrera && carrera.length > 0) {
    // Si es array lo unimos, si es string lo mandamos directo
    const carreraStr = Array.isArray(carrera) ? carrera.join(',') : carrera
    params.append('carrera', carreraStr)
  }
  if (orden) params.append('orden', orden)
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

export const createBook = async (formData) => {
  const { data } = await api.post('/books', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export const updateBook = async (id, formData) => {
  const { data } = await api.put(`/books/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export const deleteBook = async (id) => {
  const { data } = await api.delete(`/books/${id}`)
  return data
}