import { useNavigate, useParams } from 'react-router-dom'
import DetalleLibroComponent from '../LibroDetalle'

const DetalleLibroUserPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <DetalleLibroComponent
      libroId={id}
      onAgregarCarrito={(ejemplar) => {
        // lógica del carrito — después lo conectamos con contexto o estado global
        navigate('/app/carrito')
      }}
      onVolver={() => navigate('/app/catalogo')}
    />
  )
}

export default DetalleLibroUserPage