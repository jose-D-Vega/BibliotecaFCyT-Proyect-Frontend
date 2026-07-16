import "./SessionTable.css"


function SessionTable({
  sesiones
}) {


  const formatFecha = (fecha)=>{

    const date = new Date(fecha)

    return date.toLocaleDateString("es-PY")

  }


  const capitalizarNombre = (nombre = "") => {
    return nombre
      .toLowerCase()
      .split(" ")
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ");
  };


  const formatHora = (fecha)=>{

    const date = new Date(fecha)

    return date.toLocaleTimeString("es-PY",{
      hour:"2-digit",
      minute:"2-digit"
    })

  }



  return (

    <div className="session-table">


      <div className="session-table__header">
        <span>Usuario</span>
        <span>CI</span>
        <span>Correo</span>
        <span>Fecha</span>
        <span>Hora</span>
      </div>



      {
        sesiones.length === 0 ?

        (
          <div className="session-empty">
            No existen sesiones registradas
          </div>
        )

        :

        sesiones.map((sesion)=>(

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


            <span
              data-label="CI"
            >
              {sesion.ci}
            </span>


            <span
              className="session-email"
              data-label="Correo"
            >
              {sesion.correo}
            </span>


            <span
              data-label="Fecha"
            >
              {formatFecha(sesion.fecha_ingreso)}
            </span>


            <span
              data-label="Hora"
            >
              {formatHora(sesion.fecha_ingreso)}
            </span>


          </div>

        ))
      }


    </div>

  )
}


export default SessionTable