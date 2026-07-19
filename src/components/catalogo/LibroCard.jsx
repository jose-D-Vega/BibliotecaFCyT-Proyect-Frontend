import "./styles/LibroCard.css"

function LibroCard({ libro, onVerDetalle }) {
  return (
    <div className="libro-card">
      <div className="libro-card-imagen">
        {libro.imagen_url ? (
          <img src={libro.imagen_url} alt={libro.titulo} />
        ) : (
          <span className="libro-card-inicial">
            {libro.titulo?.charAt(0)}
          </span>
        )}
      </div>

      <div className="libro-card-info">
        <h3>{libro.titulo}</h3>
        <p>{libro.autor}</p>

        <p className="libro-card-disponibles">
          {libro.ejemplares_disponibles} disponibles de{" "}
          {libro.cantidad_ejemplar}
        </p>
      </div>

      <button
        className="libro-card-ver-detalles"
        onClick={() => onVerDetalle(libro)}
      >
        Ver detalles
      </button>
    </div>
  )
}

export default LibroCard