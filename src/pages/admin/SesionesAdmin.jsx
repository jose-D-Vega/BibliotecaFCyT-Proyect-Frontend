import { useEffect, useRef, useState } from "react"

import { getSesiones } from "../../services/session.services"

import SessionFilters from "../../components/sesiones/SessionFilters"
import SessionTable from "../../components/sesiones/SessionTable"
import SessionPagination from "../../components/sesiones/SessionPagination"

import "../styles/styles_admin/SesionesAdmin.css"


function SesionesAdmin(){

  const [sesiones,setSesiones] = useState([])

  const [loading,setLoading] = useState(true)


  const [usuario,setUsuario] = useState("")
  const [fechaDesde,setFechaDesde] = useState("")
  const [fechaHasta,setFechaHasta] = useState("")


  const [currentPage,setCurrentPage] = useState(1)

  const [pagination,setPagination] = useState({
    totalPages:1
  })


  const [limit,setLimit] = useState(15)


  const primeraCarga = useRef(true)
  const primeraBusqueda = useRef(true)



  useEffect(()=>{

    const adaptarLimit = ()=>{

      if(window.innerWidth <= 768){
        setLimit(5)
      }else{
        setLimit(15)
      }

    }


    adaptarLimit()


    window.addEventListener(
      "resize",
      adaptarLimit
    )


    return ()=>{

      window.removeEventListener(
        "resize",
        adaptarLimit
      )

    }


  },[])



  useEffect(()=>{

    setCurrentPage(1)

  },[limit])




  const cargarSesiones = async()=>{

    try{

      setLoading(true)


      const response = await getSesiones({

        page: currentPage,

        limit,

        usuario,

        fecha_desde: fechaDesde,

        fecha_hasta: fechaHasta

      })


      setSesiones(response.data)

      setPagination(response.pagination)


    }
    catch(error){

      console.error(
        "Error cargando sesiones:",
        error
      )

    }
    finally{

      setLoading(false)

    }

  }





  useEffect(()=>{

    cargarSesiones()

  },[
    currentPage,
    fechaDesde,
    fechaHasta,
    limit
  ])






  useEffect(()=>{


    if(primeraBusqueda.current){

      primeraBusqueda.current = false

      return

    }



    const timer=setTimeout(()=>{

      setCurrentPage(1)

      cargarSesiones()

    },500)



    return ()=>clearTimeout(timer)


  },[usuario])







  return (

    <div className="sesiones-admin">


      <div className="sesiones-admin__header">

        <h1 className="sesiones-admin__title">
          Sesiones
        </h1>

        <p>
          Historial de accesos de usuarios
        </p>

      </div>





      <SessionFilters

        usuario={usuario}

        setUsuario={setUsuario}

        fechaDesde={fechaDesde}

        setFechaDesde={(value)=>{

          setFechaDesde(value)

          setCurrentPage(1)

        }}

        fechaHasta={fechaHasta}

        setFechaHasta={(value)=>{

          setFechaHasta(value)

          setCurrentPage(1)

        }}

      />







      <div className="sesiones-admin__container">

        {
          loading ?

          (

            <div className="sesiones-loading">

              <div className="sesiones-spinner"></div>

              <p>
                Cargando sesiones...
              </p>

            </div>

          )

          :

          (

            <SessionTable
              sesiones={sesiones}
            />

          )

        }

      </div>





      <SessionPagination

        currentPage={currentPage}

        totalPages={pagination.totalPages}

        onPageChange={setCurrentPage}

      />



    </div>

  )

}


export default SesionesAdmin