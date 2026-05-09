import { useNavigate } from 'react-router-dom'
import CatalogoPublic from './CatalogoPublic'

function CatalogoPage() {
  const navigate = useNavigate()

  return (
    <CatalogoPublic
      onVerDetalle={(libro) => navigate(`/catalogo/${libro.id_libro}`)}
    />
  )
}

export default CatalogoPage