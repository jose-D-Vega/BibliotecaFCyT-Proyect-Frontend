import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getBookById, getCopiesByBook } from '../../services/books.services'
import LibroDetalle from '../../components/catalogo/LibroDetalleUser'

function LibroDetalleUserPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [libro, setLibro] = useState(null)
  const [ejemplares, setEjemplares] = useState([])
  const [loading, setLoading] = useState(true)

  const vieneDelDashboard = !!location.state?.fromDashboard

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

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

  if (loading) {
    return (
      <div className="detalle-loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <LibroDetalle
      libro={libro}
      ejemplares={ejemplares}
      onVolver={() => navigate('/app/catalogo')}
      onIrAlCarrito={() => navigate('/app/solicitudes')}
      vieneDelDashboard={vieneDelDashboard}
      onVolverInicio={() => navigate('/app/inicio')}
    />
  )
}

export default LibroDetalleUserPage