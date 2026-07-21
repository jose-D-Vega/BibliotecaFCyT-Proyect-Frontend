import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { getBookById, getCopiesByBook } from '../../services/books.services'
import LibroDetalleBibliotecario from '../../components/catalogo/LibroDetalleBibliotecario'

import "../admin/styles/LibroDetalleAdmin.css"


function LibroDetalleBibliotecarioPage() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [libro, setLibro] = useState(null)
  const [ejemplares, setEjemplares] = useState([])
  const [loading, setLoading] = useState(true)


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

      navigate("/bibliotecario/catalogo", {
        replace:true
      })

    } finally {

      setLoading(false)

    }

  }


  useEffect(() => {
    fetchData()
  }, [id])


  if(loading){
    return (
      <div className="detalle-loading">
        <div className="spinner"></div>
      </div>
    )
  }


  return (
    <LibroDetalleBibliotecario
      libro={libro}
      ejemplares={ejemplares}
      onVolver={() => navigate("/bibliotecario/catalogo")}
      onRefresh={fetchData}
    />
  )
}


export default LibroDetalleBibliotecarioPage