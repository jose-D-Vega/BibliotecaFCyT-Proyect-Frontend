import { useNavigate } from 'react-router-dom'
import CatalogoPublic from '../../components/catalogo/CatalogoPublic'

function CatalogoPage() {
  const navigate = useNavigate()

  return (
    <CatalogoPublic
      onVerDetalle={(libro) => navigate(`/catalogo/${libro.id_libro}`)}
    />
  )
}

export default CatalogoPage