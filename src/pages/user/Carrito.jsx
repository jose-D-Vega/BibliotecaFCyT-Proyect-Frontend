import "../styles/styles_user/Carrito.css"
import CarritoItem from "../../components/CarritoItem"
import { useCart } from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'

function CarritoPage() {
  const { carrito, removerDelCarrito, vaciarCarrito } = useCart()
  const navigate = useNavigate()

  return (
    <div className="carrito-page">
      <header className="carrito-header">
        <button className="carrito-volver-btn" onClick={() => navigate('/app/catalogo')}>
          ← Volver
        </button>
        <h1 className="carrito-titulo">Carrito de Préstamos</h1>
      </header>

      <main className="carrito-container">
        {carrito.length > 0 ? (
          <>
            <div className="carrito-lista">
              {carrito.map(libro => (
                <CarritoItem
                  key={libro.id_libro}
                  libro={libro}
                  onVerDetalle={() => navigate(`/app/catalogo/${libro.id_libro}`)}
                  onRemover={() => removerDelCarrito(libro.id_libro)}
                />
              ))}
            </div>
            <div className="carrito-acciones">
              <button className="carrito-accion-btn secundario" onClick={vaciarCarrito}>
                Vaciar Carrito
              </button>
              <button className="carrito-accion-btn primario">
                Realizar préstamo
              </button>
            </div>
          </>
        ) : (
          <div className="carrito-vacio">
            <h2>Tu carrito está vacío</h2>
            <p>No hay libros agregados al carrito de préstamos por el momento.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default CarritoPage