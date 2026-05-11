import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getBookById, getCopiesByBook } from '../../services/books.services'
import LibroDetallePublic from './LibroDetallePublic'

function LibroDetallePublicPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [libro, setLibro] = useState(null)
  const [ejemplares, setEjemplares] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [libroData, copiesData] = await Promise.all([
        getBookById(id),
        getCopiesByBook(id)
      ])
      setLibro(libroData)
      setEjemplares(copiesData)
    } catch {
      navigate('/catalogo', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  if (loading) return <p>Cargando...</p>

  return (
    <LibroDetallePublic
      libro={libro}
      ejemplares={ejemplares}
      onVolver={() => navigate('/catalogo')}
      onRefresh={fetchData}
    />
  )
}

export default LibroDetallePublicPage