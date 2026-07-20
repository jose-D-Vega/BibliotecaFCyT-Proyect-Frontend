import "./styles/MisSolicitudesItem.css"

function MisSolicitudesItem({ libro, onVerDetalle, onRemover }) {
  return (
    <div className="carrito-item">
      <div className="carrito-item-imagen">
        {libro.imagen_url
          ? <img src={libro.imagen_url} alt={libro.titulo} />
          : <div className="portada-placeholder">{libro.titulo?.charAt(0)}</div>
        }
        
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

export default MisSolicitudesItem