import { useNavigate } from 'react-router-dom'
import Catalogo from '../../components/catalogo/CatalogoUser'

function CatalogoUserPage() {
  const navigate = useNavigate()

  return (
    <Catalogo
      onVerDetalle={(libro) => navigate(`/app/catalogo/${libro.id_libro}`)}
      onIrAlCarrito={() => navigate('/app/solicitudes')}
    />
  )
}

export default CatalogoUserPage