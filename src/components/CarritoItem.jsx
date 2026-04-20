import "./styles/CarritoItem.css"

function CarritoItem({ libro, onVerDetalle, onRemover }) {
  return (
    <div className="carrito-item">
      <div className="carrito-item-imagen">
        <img src={libro.imagen} alt={libro.titulo} />
      </div>

      <div className="carrito-item-info">
        <h3>{libro.titulo}</h3>
        <p>{libro.autor}</p>
      </div>

      <div className="carrito-item-botones">
        <button
          className="carrito-item-btn"
          onClick={() => onVerDetalle(libro)}
        >
          Ver Detalle
        </button>

        <button
          className="carrito-item-btn remover"
          onClick={() => onRemover(libro.id)}
        >
          Remover
        </button>
      </div>
    </div>
  )
}

export default CarritoItem