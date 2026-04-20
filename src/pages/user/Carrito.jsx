import "../../pages/styles/Carrito.css"
import CarritoItem from "../../components/CarritoItem"

function Carrito({
  carrito,
  onVolver,
  onVerDetalle,
  onRemover,
  onVaciarCarrito
}) {
  return (
    <div className="carrito-page">
      <header className="carrito-header">
        <button className="carrito-volver-btn" onClick={onVolver}>
          ← Volver
        </button>

        <h1 className="carrito-titulo">Carrito de Préstamos</h1>
      </header>

      <main className="carrito-container">
        {carrito.length > 0 ? (
          <>
            <div className="carrito-lista">
              {carrito.map((libro) => (
                <CarritoItem
                  key={libro.id}
                  libro={libro}
                  onVerDetalle={onVerDetalle}
                  onRemover={onRemover}
                />
              ))}
            </div>

            <div className="carrito-acciones">
              <button
                className="carrito-accion-btn secundario"
                onClick={onVaciarCarrito}
              >
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

export default Carrito