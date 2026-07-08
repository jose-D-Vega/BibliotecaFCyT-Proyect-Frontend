import PrestamoEstadoBadge from "./PrestamoEstadoBadge"


function getFecha(label, fecha){
  if(!fecha) return null

  return (
    <div className="prestamo-info-date">
      <span>{label}</span>
      <strong>{fecha}</strong>
    </div>
  )
}



function PrestamoDetalleInfo({
  prestamo,
  estado
}){

  const actual = estado?.toLowerCase() || ""

  const esReserva =
    actual.includes("reserva")


  const fechas=[]



  // solicitud inicial

  fechas.push(
    getFecha(
      esReserva
        ? "Reserva solicitada en"
        : "Préstamo solicitado en",
      prestamo.fechaPrestamo
    )
  )



  // aprobación / rechazo

  if(
    [
      "aprobado",
      "parcialmente_aprobado"
    ].includes(actual)
  ){

    fechas.push(
      getFecha(
        "Préstamo aprobado en",
        prestamo.fechaRespuesta
      )
    )

  }



  if(
    [
      "reserva_aprobada",
      "reserva_parcialmente_aprobada"
    ].includes(actual)
  ){

    fechas.push(
      getFecha(
        "Reserva aprobada en",
        prestamo.fechaRespuesta
      )
    )

  }



  if(actual==="rechazado"){

    fechas.push(
      getFecha(
        "Préstamo rechazado en",
        prestamo.fechaRespuesta
      )
    )

  }



  // activo

  if(actual==="activo"){

    fechas.push(
      getFecha(
        "Préstamo aprobado en",
        prestamo.fechaRespuesta
      )
    )


    fechas.push(
      getFecha(
        "Préstamo activado en",
        prestamo.fechaActivacion
      )
    )


    fechas.push(
      getFecha(
        "Devolución máxima",
        prestamo.fechaEntrega
      )
    )

  }



  // vencido

  if(actual==="vencido"){

    fechas.push(
      getFecha(
        "Fecha tope devolución",
        prestamo.fechaEntrega
      )
    )

  }




  // devuelto

  if(actual==="devuelto"){

    fechas.push(
      getFecha(
        "Préstamo aprobado en",
        prestamo.fechaRespuesta
      )
    )


    fechas.push(
      getFecha(
        "Préstamo activado en",
        prestamo.fechaActivacion
      )
    )


    fechas.push(
      getFecha(
        "Devolución máxima",
        prestamo.fechaEntrega
      )
    )

  }




  return (

    <section className="prestamo-detalle-info">


      <div>

        <span>
          Estado
        </span>


        <PrestamoEstadoBadge
          estado={actual}
        />

      </div>



      <div className="prestamo-detalle-info-extra">

        {
          fechas.filter(Boolean)
        }

      </div>


    </section>

  )

}


export default PrestamoDetalleInfo