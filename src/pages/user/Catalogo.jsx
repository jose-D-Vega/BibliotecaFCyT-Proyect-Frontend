import { useState, useEffect } from "react"
import Buscador from "../../components/Buscador"
import Filtros from "../../components/Filtros"
import ListaLibros from "../../components/ListaLibros"
import CatalogoPagination from "../../components/CatalogoPagination"
import "../styles/styles_user/Catalogo.css"

function Catalogo({ onVerDetalle, onIrAlCarrito }) {
  const [pagina, setPagina] = useState(1)
  const [busqueda, setBusqueda] = useState("")
  const [modoBusqueda, setModoBusqueda] = useState("titulo")
  const [areas, setAreas] = useState([])
  const [tipo, setTipo] = useState("")
  const [orden, setOrden] = useState("AZ")
  const [totalPaginas, setTotalPaginas] = useState(1)

  useEffect(() => {
    setPagina(1)
  }, [busqueda, modoBusqueda, areas, tipo, orden])

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

          <button className="carrito-btn" onClick={onIrAlCarrito}>
            📚 Mis solicitudes
          </button>
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
      </div>

      {/* 🔥 IMPORTANTE: mismo bloque visual */}
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

export default Catalogo