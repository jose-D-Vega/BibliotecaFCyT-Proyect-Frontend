import "./styles/PrestamoTabs.css"

function PrestamoTabs({ activeTab, setActiveTab }) {
  return (
    <div className="prestamo-tabs">

      <button
        className={activeTab === "solicitudes" ? "active" : ""}
        onClick={() => setActiveTab("solicitudes")}
      >
        Solicitudes
      </button>

      <button
        className={activeTab === "prestamos" ? "active" : ""}
        onClick={() => setActiveTab("prestamos")}
      >
        Todos los préstamos
      </button>

    </div>
  )
}

export default PrestamoTabs