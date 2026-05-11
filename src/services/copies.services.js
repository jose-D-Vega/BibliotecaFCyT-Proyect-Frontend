import api from './api'

export const getCopiesByBook = async (id_libro) => {
  const { data } = await api.get(`/books/${id_libro}/copies`)
  return data.data
}

export const deleteCopy = async (id_libro, id_ejemplar) => {
  const { data } = await api.delete(`/books/${id_libro}/copies/${id_ejemplar}`)
  return data
}

export const addCopies = async (id_libro, cantidad) => {
  const { data } = await api.post(`/books/${id_libro}/copies`, { cantidad })
  return data
}