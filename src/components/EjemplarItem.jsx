import "./styles/EjemplarItem.css"

function EjemplarItem({ ejemplar }) {
  return (
    <div className="ejemplar">
      <div className="ejemplar-info">
        <span className="ejemplar-codigo">{ejemplar.codigo}</span>
      </div>

      <span
        className={`ejemplar-estado ${
          ejemplar.estado === "Disponible" ? "disponible" : "prestamo"
        }`}
      >
        {ejemplar.estado}
      </span>
    </div>
  )
}

export default EjemplarItem