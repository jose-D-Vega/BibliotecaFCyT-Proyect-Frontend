import "./styles/Buscador.css"

function Buscador({ busqueda, setBusqueda, setBusquedaAplicada }) {

  const realizarBusqueda = () => {
    setBusquedaAplicada(busqueda)
  }

  const limpiarBusqueda = () => {
    setBusqueda("")
    setBusquedaAplicada("")
  }

  return (
    <div className="buscador-container">
      <input
        className="buscador"
        placeholder="Buscar por título o autor..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <button
        className="buscar-btn"
        onClick={realizarBusqueda}
      >
        Realizar búsqueda
      </button>

      <button
        className="limpiar-btn"
        onClick={limpiarBusqueda}
      >
        Limpiar
      </button>
    </div>
  )
}

export default Buscador