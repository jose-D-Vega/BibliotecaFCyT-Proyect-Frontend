import "./SessionFilters.css"

function SessionFilters({
  usuario,
  setUsuario,
  fechaDesde,
  setFechaDesde,
  fechaHasta,
  setFechaHasta
}) {

  return (
    <div className="session-filters">

      <div className="session-filter">

        <label className="session-filter__label">
          Usuario
        </label>

        <input
          type="text"
          placeholder="Ingresar nombre de usuario, cédula de identidad o correo"
          value={usuario}
          onChange={(e)=>setUsuario(e.target.value)}
        />

      </div>



      <div className="session-filter">

        <label className="session-filter__label">
          Desde
        </label>

        <input
          type="date"
          value={fechaDesde}
          onChange={(e)=>setFechaDesde(e.target.value)}
        />

      </div>



      <div className="session-filter">

        <label className="session-filter__label">
          Hasta
        </label>

        <input
          type="date"
          value={fechaHasta}
          onChange={(e)=>setFechaHasta(e.target.value)}
        />

      </div>


    </div>
  )
}


export default SessionFilters