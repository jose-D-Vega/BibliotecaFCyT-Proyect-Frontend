import "./styles/Catalogo.css";
import Buscador from "./Buscador";
import Filtros from "./Filtros";
import ListaLibros from "./ListaLibros";
import CatalogoPagination from "./CatalogoPagination";
import FooterLogin from "../login/FooterLogin";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CatalogoPublic({ onVerDetalle }) {
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [modoBusqueda, setModoBusqueda] = useState("titulo");
  const [areas, setAreas] = useState([]);
  const [tipo, setTipo] = useState("");
  const [orden, setOrden] = useState("AZ");
  const [totalPaginas, setTotalPaginas] = useState(3);

  const navigate = useNavigate();

  useEffect(() => {
    setPagina(1);
  }, [busqueda, modoBusqueda, areas, tipo, orden]);

  const resetFiltros = () => {
    setAreas([]);
    setTipo("");
    setOrden("AZ");
  };

  const todosActivos = areas.length === 0 && tipo === "" && orden === "AZ";

  return (
    <div className="public-page">
      <div className="catalogo">

        <div className="catalogo-header">
          <div className="header-top">
            <h1 className="titulo">Catálogo</h1>

            <button
              className="login-redirect-btn"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
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
      setPagina(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
  />
</div>

      </div>

      <FooterLogin />
    </div>
  );
}

export default CatalogoPublic;