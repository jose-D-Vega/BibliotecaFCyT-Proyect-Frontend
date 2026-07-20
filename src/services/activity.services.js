import api from "./api"

export const getActividades = async (filtros = {}) => {
  const params = new URLSearchParams()

  Object.entries(filtros).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value)
    }
  })

  const { data } = await api.get(`/activity?${params.toString()}`)
  return data
}