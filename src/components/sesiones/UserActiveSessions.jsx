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

    } catch (error) {

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



  const formatearFecha = (fecha) => {

    const date = new Date(fecha)

    return date.toLocaleDateString(
      'es-PY',
      {
        day:'2-digit',
        month:'2-digit',
        year:'numeric'
      }
    )

  }



  const formatearHora = (fecha) => {

    const date = new Date(fecha)

    return date.toLocaleTimeString(
      'es-PY',
      {
        hour:'2-digit',
        minute:'2-digit'
      }
    )

  }



  return (

    <div className="active-sessions">


      <h2 className="active-sessions__title">
        Mis sesiones activas
      </h2>



      {
        loading

        ?

        (
          <div className="active-sessions__loading">
            Cargando sesiones...
          </div>
        )


        :


        sesiones.length === 0

        ?

        (
          <div className="active-sessions__empty">
            No hay sesiones activas
          </div>
        )


        :


        (

          <div className="active-session-table">


            <div className="active-session-table__header">

              <span>
                Fecha de ingreso
              </span>

              <span>
                Hora
              </span>

              <span>
                Estado
              </span>

            </div>



            {
              sesiones.map((sesion) => (

                <div
                  className="active-session-table__row"
                  key={sesion.id_sesion}
                >


                  <span data-label="Fecha de ingreso">
                    {formatearFecha(sesion.fecha_ingreso)}
                  </span>


                  <span data-label="Hora">
                    {formatearHora(sesion.fecha_ingreso)}
                  </span>


                  <span data-label="Estado">

                    <span className="active-session__badge">
                      Activa
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