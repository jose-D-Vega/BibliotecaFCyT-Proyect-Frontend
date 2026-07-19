import "../styles/styles_user/Catalogo.css"
import "../styles/styles_admin/CatalogoAdmin.css"
import Buscador from "../../components/Buscador"
import Filtros from "../../components/Filtros"
import ListaLibros from "../../components/ListaLibros"
import CatalogoPagination from "../../components/CatalogoPagination"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function CatalogoAdmin({ onVerDetalle, onNuevoLibro }) {
  const navigate = useNavigate()

  const [pagina, setPagina] = useState(1)
  const [busqueda, setBusqueda] = useState("")
  const [busquedaAplicada, setBusquedaAplicada] = useState("")
  const [areas, setAreas] = useState([])
  const [tipo, setTipo] = useState("")
  const [orden, setOrden] = useState("AZ")
  const [totalPaginas, setTotalPaginas] = useState(1)

  useEffect(() => {
    setPagina(1)
  }, [busquedaAplicada, areas, tipo, orden])

  const resetFiltros = () => {
    setAreas([])
    setTipo("")
    setOrden("AZ")
  }

  const todosActivos = areas.length === 0 && tipo === "" && orden === "AZ"

  return (
    <div className="catalogo">

      <div className="catalogo-header">
        <div className="header-top">
          <h1 className="titulo">Catálogo</h1>
        </div>

          <Buscador
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            setBusquedaAplicada={setBusquedaAplicada}
          />

        <Filtros
          areas={areas}
          setAreas={setAreas}
          tipo={tipo}
          setTipo={setTipo}
          orden={orden}
          setOrden={setOrden}
          resetFiltros={resetFiltros}
          todosActivos={todosActivos}
        />

        <button
          className="admin-add-material-btn"
          onClick={onNuevoLibro}
        >
          Añadir nuevo material
        </button>
      </div>

      {/* 🔥 BLOQUE UNIFICADO (GRID + PAGINACIÓN) */}
      <div className="catalogo-body">

        <ListaLibros
          pagina={pagina}
          setPagina={setPagina}
          busqueda={busquedaAplicada}
          areas={areas}
          tipo={tipo}
          orden={orden}
          setTotalPaginas={setTotalPaginas}
          onVerDetalle={onVerDetalle}
        />

        <CatalogoPagination
          currentPage={pagina}
          totalPages={totalPaginas}
          onPageChange={(page) => {
            setPagina(page)
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
        />

      </div>

    </div>
  )
}

export default CatalogoAdmin