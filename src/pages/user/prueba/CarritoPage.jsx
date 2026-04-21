import { useNavigate } from 'react-router-dom'
import CarritoComponent from '../Carrito'

const CatalogoUserPage = () => {
  const navigate = useNavigate()

  return (
    <CarritoComponent
        carrito={carrito}
        onVolver={volverDesdeCarrito}
        onVerDetalle={verDetalleDesdeCarrito}
        onRemover={removerDelCarrito}
        onVaciarCarrito={vaciarCarrito}
    />
  )
}

export default CatalogoUserPage