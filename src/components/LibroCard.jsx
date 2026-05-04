import "./Prueba/LibroCard.css"

function LibroCard({ libro, onVerDetalle }) {
  return (
    <div className="card">
      <div className="card-imagen">
        {libro.imagen_url
          ? <img src={libro.imagen_url} alt={libro.titulo} />
          : <span className="card-inicial">{libro.titulo?.charAt(0)}</span>
        }
      </div>
      <div className="info">
        <h3>{libro.titulo}</h3>
        <p>{libro.autor}</p>
        <p className="card-disponibles">
          {libro.ejemplares_disponibles} disponibles de {libro.cantidad_ejemplar}
        </p>
      </div>
      <button className="ver-detalles" onClick={() => onVerDetalle(libro)}>
        Ver detalles
      </button>
    </div>
  )
}

export default LibroCard