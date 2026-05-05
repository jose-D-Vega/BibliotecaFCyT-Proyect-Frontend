import "../../pages/styles/Catalogo.css"
import "../../pages/styles/CatalogoAdmin.css"
import Buscador from "../../components/Buscador"
import Filtros from "../../components/Filtros"
import ListaLibros from "../../components/ListaLibros"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function CatalogoAdmin({ onVerDetalle }) {
  const navigate = useNavigate()

  const [pagina, setPagina] = useState(1)

  const [busqueda, setBusqueda] = useState("")
  const [modoBusqueda, setModoBusqueda] = useState("titulo")

  const [areas, setAreas] = useState([])
  const [tipo, setTipo] = useState("")
  const [orden, setOrden] = useState("AZ")

  const [totalPaginas, setTotalPaginas] = useState(3)

  useEffect(() => {
    setPagina(1)
  }, [busqueda, modoBusqueda, areas, tipo, orden])

  const resetFiltros = () => {
    setAreas([])
    setTipo("")
    setOrden("AZ")
  }

  const todosActivos =
    areas.length === 0 &&
    tipo === "" &&
    orden === "AZ"

  return (
    <div className="catalogo">
      <div className="catalogo-header">
        <div className="header-top">
          <h1 className="titulo">Catálogo</h1>
        </div>

        <Buscador
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          modoBusqueda={modoBusqueda}
          setModoBusqueda={setModoBusqueda}
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
          onClick={() => navigate("/admin/catalogo/nuevo")}
        >
          Añadir nuevo material
        </button>
      </div>

      <div className="catalogo-body">
        <ListaLibros
          pagina={pagina}
          setPagina={setPagina}
          busqueda={busqueda}
          modoBusqueda={modoBusqueda}
          areas={areas}
          tipo={tipo}
          orden={orden}
          setTotalPaginas={setTotalPaginas}
          onVerDetalle={onVerDetalle}
        />
      </div>

      <div className="paginacion">
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            className={pagina === i + 1 ? "active" : ""}
            onClick={() => {
              setPagina(i + 1)
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CatalogoAdmin