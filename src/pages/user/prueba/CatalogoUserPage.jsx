import { useNavigate } from 'react-router-dom'
import Catalogo from '../Catalogo'

function CatalogoUserPage() {
  const navigate = useNavigate()

  return (
    <Catalogo
      onVerDetalle={(libro) => navigate(`/app/catalogo/${libro.id_libro}`)}
      onIrAlCarrito={() => navigate('/app/carrito')}
    />
  )
}

export default CatalogoUserPage