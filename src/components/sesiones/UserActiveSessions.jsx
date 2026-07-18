import { useEffect, useState } from 'react'

import { getMisSesionesActivas } from '../../services/session.services'

import './UserActiveSessions.css'


const UserActiveSessions = () => {

  const [sesiones, setSesiones] = useState([])
  const [loading, setLoading] = useState(true)


  const cargarSesiones = async () => {

    try {

      setLoading(true)

      const data = await getMisSesionesActivas()

      setSesiones(data)

    } catch(error) {

      console.error(
        'Error al cargar sesiones activas:',
        error
      )

    } finally {

      setLoading(false)

    }

  }


  useEffect(() => {

    cargarSesiones()

  }, [])



  const formatearFechaCompleta = (fecha) => {

    if(!fecha)
      return "-"

    return new Date(fecha).toLocaleString(
      'es-PY',
      {
        day:'2-digit',
        month:'2-digit',
        year:'numeric',
        hour:'2-digit',
        minute:'2-digit'
      }
    )

  }



  const obtenerEstadoVisual = (sesion) => {

    if(sesion.estado !== "Activo")
      return sesion.estado


    const ahora = new Date()

    const ultima = new Date(
      sesion.ultima_actividad
    )


    const diferencia =
      (ahora - ultima) / 1000 / 60


    if(diferencia > 15)
      return "Inactiva"


    return "Activa"

  }



const obtenerDispositivo = (userAgent) => {

  if(!userAgent)
    return "Desconocido"


  if(/Android|Mobile/i.test(userAgent))
    return "Móvil"


  if(/iPad|Tablet/i.test(userAgent))
    return "Tablet"


  if(/Windows/i.test(userAgent))
    return "Windows"


  if(/Macintosh|Mac OS/i.test(userAgent))
    return "macOS"


  if(/Linux/i.test(userAgent))
    return "Linux"


  return "PC"

}



const obtenerNavegador = (userAgent) => {

  if(!userAgent)
    return "Desconocido"


  if(
    userAgent.includes("OPR") ||
    userAgent.includes("Opera")
  )
    return "Opera"


  if(userAgent.includes("Edg"))
    return "Microsoft Edge"


  if(
    userAgent.includes("Chrome") &&
    !userAgent.includes("OPR")
  )
    return "Google Chrome"


  if(userAgent.includes("Firefox"))
    return "Mozilla Firefox"


  if(
    userAgent.includes("Safari") &&
    !userAgent.includes("Chrome")
  )
    return "Safari"


  return "Desconocido"

}



  const claseEstado = (estado) => {

    switch(estado){

      case "Activa":
        return "active-session__badge active"

      case "Inactiva":
        return "active-session__badge inactive"

      case "Expirada":
      case "Cerrada":
      case "Revocada":
        return "active-session__badge expired"

      default:
        return "active-session__badge"

    }

  }



  return (

    <div className="active-sessions">

      <h2 className="active-sessions__title">
        Mis sesiones activas
      </h2>


      {
        loading ?

        (
          <div className="active-sessions__loading">
            Cargando sesiones...
          </div>
        )

        :

        sesiones.length === 0 ?

        (
          <div className="active-sessions__empty">
            No hay sesiones activas
          </div>
        )

        :

        (

          <div className="active-session-table">

            <div className="active-session-table__header">

              <span>Inicio</span>
              <span>Última actividad</span>
              <span>Dispositivo</span>
              <span>Navegador</span>
              <span>IP</span>
              <span>Estado</span>

            </div>


            {
              sesiones.map((sesion)=>(

                <div
                    className={`active-session-table__row ${
                      sesion.es_actual ? "current-session" : ""
                    }`}
                    key={sesion.id_sesion}
                  >

                  <span data-label="Inicio">
                    {formatearFechaCompleta(
                      sesion.fecha_ingreso
                    )}
                  </span>


                  <span data-label="Última actividad">
                    {formatearFechaCompleta(
                      sesion.ultima_actividad
                    )}
                  </span>


                  <span data-label="Dispositivo">
                    {obtenerDispositivo(
                      sesion.user_agent
                    )}
                  </span>


                  <span data-label="Navegador">
                    {obtenerNavegador(
                      sesion.user_agent
                    )}
                  </span>


                  <span data-label="IP">
                    {sesion.ip || "-"}
                  </span>


                  <span data-label="Estado">

                    <span
                      className={
                        claseEstado(
                          obtenerEstadoVisual(sesion)
                        )
                      }
                    >
                      {
                        obtenerEstadoVisual(sesion)
                      }
                    </span>

                  </span>


                </div>

              ))
            }


          </div>

        )

      }


    </div>

  )

}


export default UserActiveSessions