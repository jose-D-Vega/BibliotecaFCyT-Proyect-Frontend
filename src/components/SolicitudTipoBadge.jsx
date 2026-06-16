import "./styles/SolicitudTipoBadge.css"

function SolicitudTipoBadge({
  tipo = "Préstamo"
}) {
  const tipoNormalizado =
    tipo.toLowerCase()

  let badgeClass =
    "solicitud-tipo-badge"

  if (
    tipoNormalizado ===
    "préstamo"
  ) {
    badgeClass +=
      " solicitud-tipo-badge--prestamo"
  }

  if (
    tipoNormalizado ===
    "reserva"
  ) {
    badgeClass +=
      " solicitud-tipo-badge--reserva"
  }

  if (
    tipoNormalizado ===
    "renovación"
  ) {
    badgeClass +=
      " solicitud-tipo-badge--renovacion"
  }

  return (
    <span className={badgeClass}>
      {tipo}
    </span>
  )
}

export default SolicitudTipoBadge