import "./styles/PrestamoEstadoBadge.css"

const normalizeEstado = (str = "") =>
  str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/_/g, "-")

function getEstadoLabel(estado = "") {
  switch (estado) {
    case "parcialmente_aprobado":
      return "Parcialmente aprobado"

    case "reserva_parcialmente_aprobada":
      return "Reserva parcialmente aprobada"

    case "solicitud_reserva":
      return "Solicitud de reserva"

    case "solicitud_renovacion":
      return "Solicitud de renovación"

    case "reserva_aprobada":
      return "Reserva aprobada"

    case "activo":
      return "Activo"

    case "devuelto":
      return "Devuelto"

    case "vencido":
      return "Vencido"

    case "rechazado":
      return "Rechazado"

    case "aprobado":
      return "Aprobado"

    default:
      return estado
  }
}

function PrestamoEstadoBadge({ estado }) {
  const estadoClass = normalizeEstado(estado)

  return (
    <span className={`estado-badge ${estadoClass}`}>
      {getEstadoLabel(estado)}
    </span>
  )
}

export default PrestamoEstadoBadge