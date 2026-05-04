import "./styles/EjemplarItem.css"

function EjemplarItem({ ejemplar }) {
  return (
    <div className="ejemplar">
      <div className="ejemplar-info">
        <span className="ejemplar-codigo">{ejemplar.id_ejemplar}</span>
      </div>

      <span
        className={`ejemplar-estado ${
          ejemplar.estado_ejemplar === "disponible" ? "disponible" : "prestamo"
        }`}
      >
        {ejemplar.estado_ejemplar}
      </span>
    </div>
  )
}

export default EjemplarItem