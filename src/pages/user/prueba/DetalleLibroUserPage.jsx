import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getBookById, getCopiesByBook } from '../../../services/books.services'
import LibroDetalle from '../LibroDetalle'

function DetalleLibroUserPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [libro, setLibro] = useState(null)
  const [ejemplares, setEjemplares] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [libroData, copiesData] = await Promise.all([
          getBookById(id),
          getCopiesByBook(id)
        ])
        setLibro(libroData)
        setEjemplares(copiesData)
      } catch {
        navigate('/app/catalogo', { replace: true })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) return <p>Cargando...</p>

  return (
    <LibroDetalle
      libro={libro}
      ejemplares={ejemplares}
      onVolver={() => navigate('/app/catalogo')}
      onIrAlCarrito={() => navigate('/app/carrito')}
    />
  )
}

export default DetalleLibroUserPage