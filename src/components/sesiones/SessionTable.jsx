import "./SessionTable.css"

function SessionTable({ sesiones }) {

  const formatFechaHora = (fecha) => {

    if (!fecha) return "-"

    return new Date(fecha).toLocaleString("es-PY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })

  }

  const capitalizarNombre = (nombre = "") => {

    return nombre
      .toLowerCase()
      .split(" ")
      .map(
        palabra =>
          palabra.charAt(0).toUpperCase() +
          palabra.slice(1)
      )
      .join(" ")

  }

  const obtenerDispositivo = (userAgent) => {

    if (!userAgent) return "Desconocido"

    if (userAgent.includes("Windows")) return "Windows"

    if (
      userAgent.includes("iPhone") ||
      userAgent.includes("iPad") ||
      userAgent.includes("iPod")
    ) {
      return "iOS"
    }

    if (userAgent.includes("Android")) return "Android"

    if (userAgent.includes("Macintosh")) return "macOS"

    if (userAgent.includes("Linux")) return "Linux"

    return "Desconocido"

  }

  const obtenerNavegador = (userAgent) => {

    if (!userAgent) return "Desconocido"

    if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
      return "Opera"
    }

    if (userAgent.includes("Edg")) {
      return "Microsoft Edge"
    }

    if (
      userAgent.includes("Brave") ||
      userAgent.includes("Brave/")
    ) {
      return "Brave"
    }

    if (
      userAgent.includes("Chrome") &&
      !userAgent.includes("Edg") &&
      !userAgent.includes("OPR")
    ) {
      return "Google Chrome"
    }

    if (userAgent.includes("Firefox")) {
      return "Mozilla Firefox"
    }

    if (
      userAgent.includes("Safari") &&
      !userAgent.includes("Chrome") &&
      !userAgent.includes("OPR") &&
      !userAgent.includes("Edg")
    ) {
      return "Safari"
    }

    return "Desconocido"

  }

  const claseEstado = (estado) => {

    switch (estado) {

      case "Activo":
        return "status-active"

      case "Expirada":
        return "status-expired"

      case "Revocada":
        return "status-revoked"

      case "Cerrada":
        return "status-closed"

      default:
        return ""

    }

  }

  return (

    <div className="session-table">

      <div className="session-table__header">
        <span>Usuario</span>
        <span>CI</span>
        <span>Correo</span>
        <span>Inicio</span>
        <span>Dispositivo</span>
        <span>Navegador</span>
        <span>Dirección IP</span>
        <span>Estado</span>
      </div>

      {
        sesiones.length === 0 ? (

          <div className="session-empty">
            No existen sesiones registradas
          </div>

        ) : (

          sesiones.map((sesion) => (

            <div
              className="session-table__row"
              key={sesion.id_sesion}
            >

              <span
                className="session-user"
                data-label="Usuario"
              >
                {capitalizarNombre(sesion.usuario)}
              </span>

              <span data-label="CI">
                {sesion.ci}
              </span>

              <span
                className="session-email"
                data-label="Correo"
              >
                {sesion.correo}
              </span>

              <span data-label="Inicio">
                {formatFechaHora(sesion.fecha_ingreso)}
              </span>

              <span data-label="Dispositivo">
                {obtenerDispositivo(sesion.user_agent)}
              </span>

              <span data-label="Navegador">
                {obtenerNavegador(sesion.user_agent)}
              </span>

              <span data-label="Dirección IP">
                {sesion.ip || "-"}
              </span>

              <span data-label="Estado">
                <span className={`session-status ${claseEstado(sesion.estado)}`}>
                  {sesion.estado}
                </span>
              </span>

            </div>

          ))

        )
      }

    </div>

  )

}

export default SessionTable