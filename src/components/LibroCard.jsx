import "../components/styles/LibroCard.css"

function LibroCard({ key, libro, onVerDetalle }) {
  return (
    <div className="card">

      <img src={libro.imagen} alt={libro.titulo} />

      <div className="info">
        <h3>{libro.titulo}</h3>
        <p>{libro.autor}</p>
      </div>

      <button
        className="ver-detalles"
        onClick={() => onVerDetalle(libro)}
      >
        Ver detalles
      </button>

    </div>
  )
}

export default LibroCard