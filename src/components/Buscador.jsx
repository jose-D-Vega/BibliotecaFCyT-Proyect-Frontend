import "../components/styles/Buscador.css"

function Buscador({ busqueda, setBusqueda, modoBusqueda, setModoBusqueda }) {
  return (
    <div className="buscador-container">

      <input
        className="buscador"
        placeholder={`Buscar por ${modoBusqueda}...`}
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

<button
  className="modo-btn"
  onClick={() =>
    setModoBusqueda(
      modoBusqueda === "titulo" ? "autor" : "titulo"
    )
  }
>
  Buscar por: {modoBusqueda === "titulo" ? "Título" : "Autor"}
</button>

    </div>
  )
}

export default Buscador