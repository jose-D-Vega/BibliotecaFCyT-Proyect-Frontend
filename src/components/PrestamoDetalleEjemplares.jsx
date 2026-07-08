function formatEstado(text){
  return (text || "")
    .replaceAll("_"," ")
    .toLowerCase()
    .replace(/\b\w/g,l=>l.toUpperCase())
}


function PrestamoDetalleEjemplares({
  materiales,
  detalles,
  estado
}){


  function getDetalle(id){
    return detalles.find(
      d=>d.id_ejemplar===id
    )
  }


  function formatFecha(fecha){
    if(!fecha) return ""

    return fecha.split("T")[0]
  }



  return (

    <div className="prestamo-detalle-content">


      {
        materiales.map((material,i)=>(

          <div
            key={i}
            className="prestamo-material-item"
          >


            <div className="prestamo-material-item__top">


              <div className="prestamo-material-item__info">

                <h3>
                  {material.titulo}
                </h3>


                <span>
                  {material.autor}
                </span>


              </div>



              <div className="prestamo-material-item__quantity">

                {material.ejemplares?.length || 0}
                {" "}
                ejemplares

              </div>


            </div>




            <div className="prestamo-material-item__copies">


              {
                (material.ejemplares || [])
                .map(id=>{


                  const detalle=getDetalle(id)


                  const estadoEjemplar =
                    detalle?.estado_prestamo_ejemplar
                    ?.toLowerCase()



                  const clase =
                    estadoEjemplar==="aprobado"
                    ? "prestamo-copy-row--approved"
                    :
                    estadoEjemplar==="rechazado"
                    ? "prestamo-copy-row--rejected"
                    :
                    ""



                  return (

                    <div
                      key={id}
                      className={`prestamo-copy-row ${clase}`}
                    >



                      <div className="prestamo-copy-row__left">


                        <div className="prestamo-copy-row__icon">
                          📘
                        </div>



                        <div className="prestamo-copy-info">


                          <span>
                            Ejemplar #{id}
                          </span>



                          {
                            detalle?.observaciones &&
                            (
                              <small className="prestamo-copy-observation">
                                {detalle.observaciones}
                              </small>
                            )
                          }



                        </div>


                      </div>





                      {
                        estado?.toLowerCase()==="devuelto" &&
                        detalle?.fecha_devolucion &&
                        (
                          <div className="prestamo-copy-return">

                            <small>
                              Se devolvió en
                            </small>

                            <strong>
                              {formatFecha(detalle.fecha_devolucion)}
                            </strong>

                          </div>
                        )
                      }






                      {
                        estadoEjemplar &&
                        (
                          <div
                            className={
                              `prestamo-copy-status prestamo-copy-status--${estadoEjemplar}`
                            }
                          >

                            {formatEstado(estadoEjemplar)}

                          </div>
                        )
                      }



                    </div>

                  )

                })
              }


            </div>


          </div>

        ))
      }


    </div>

  )

}


export default PrestamoDetalleEjemplares