import { useMemo, useState } from "react"
import "../../pages/styles/LibroDetalle.css"
import "../../pages/styles/LibroDetalleAdmin.css"
import LibroInfoItem from "../../components/LibroInfoItem"

function LibroDetalleAdmin({ libro, onVolver }) {
  const [modal, setModal] = useState(null)
  const [ejemplarSeleccionado, setEjemplarSeleccionado] = useState(null)

  const data = useMemo(() => {
    const fallbackEjemplares = [
      { codigo: "Ejemplar #1", estado: "Disponible" },
      { codigo: "Ejemplar #2", estado: "Disponible" },
      { codigo: "Ejemplar #3", estado: "En préstamo" }
    ]

    return libro || {
      id: 0,
      titulo: "Libro de Ejemplo",
      autor: "Autor Ejemplo",
      editorial: "Editorial Ejemplo",
      anio: "2023",
      facultad: "Facultad de Ciencias y Tecnologías UNCA",
      ciudad: "Coronel Oviedo",
      area: ["Informática"],
      imagen: "https://covers.openlibrary.org/b/id/10523338-L.jpg",
      ejemplaresDetalle: fallbackEjemplares,
      ejemplares: fallbackEjemplares.length
    }
  }, [libro])

  const ejemplares = data.ejemplaresDetalle || []
  const ejemplaresTotal = ejemplares.length
  const disponibles = ejemplares.filter(
    (ejemplar) => ejemplar.estado === "Disponible"
  ).length
  const enPrestamo = ejemplaresTotal - disponibles

  const areaTexto = Array.isArray(data.area)
    ? data.area.join(", ")
    : data.area

  const abrirEliminarMaterial = () => {
    setModal("eliminarMaterial")
  }

  const abrirEliminarEjemplar = (ejemplar) => {
    setEjemplarSeleccionado(ejemplar)
    setModal("eliminarEjemplar")
  }

  const cerrarModal = () => {
    setModal(null)
    setEjemplarSeleccionado(null)
  }

  return (
    <div className="detalle-page">
      <header className="detalle-header">
        <button className="btn-volver" onClick={onVolver}>
          ← Volver
        </button>

        <h2 className="header-title">Detalles del libro</h2>
      </header>

      <main className="detalle-container">
        <section className="detalle-card">
          <div className="portada-wrapper">
            <div className="portada">
              <img src={data.imagen} alt="portada" />
            </div>

            <button className="admin-action-btn admin-modify-btn">
              Modificar material
            </button>

            <button
              className="admin-action-btn admin-delete-material-btn"
              onClick={abrirEliminarMaterial}
            >
              Eliminar material
            </button>
          </div>

          <div className="info">
            <h1 className="titulo-libro">{data.titulo}</h1>

            <div className="resumen-ejemplares">
              <span className="resumen-badge disponible">
                {disponibles} disponibles
              </span>
              <span className="resumen-badge prestamo">
                {enPrestamo} en préstamo
              </span>
            </div>

            <div className="info-grid">
              <LibroInfoItem label="Autor" value={data.autor} />
              <LibroInfoItem label="Editorial" value={data.editorial} />
              <LibroInfoItem label="Año de publicación" value={data.anio} />
              <LibroInfoItem label="Ejemplares" value={ejemplaresTotal} />
              <LibroInfoItem label="Facultad" value={data.facultad} />
              <LibroInfoItem label="Ciudad" value={data.ciudad} />
              <LibroInfoItem label="Área" value={areaTexto} full />
            </div>
          </div>
        </section>

        <section className="ejemplares-section">
          <details className="ejemplares-dropdown">
            <summary className="ejemplares-title">
              Ejemplares
            </summary>

            <div className="ejemplares-lista">
              {ejemplares.map((ejemplar, i) => (
                <div key={i} className="admin-ejemplar-item">
                  <div className="admin-ejemplar-info">
                    <span className="admin-ejemplar-codigo">
                      {ejemplar.codigo}
                    </span>
                  </div>

                  <div className="admin-ejemplar-actions">
                    <span
                      className={`admin-ejemplar-estado ${
                        ejemplar.estado === "Disponible"
                          ? "disponible"
                          : "prestamo"
                      }`}
                    >
                      {ejemplar.estado}
                    </span>

                    <button
                      className="admin-ejemplar-delete-btn"
                      onClick={() => abrirEliminarEjemplar(ejemplar)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </section>
      </main>

      {modal === "eliminarMaterial" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Eliminar material</h3>
            <p className="modal-texto">
              ¿Estás seguro de que deseas eliminar este material?
            </p>

            <div className="modal-libro">
              <strong>{data.titulo}</strong>
              <span>{data.autor}</span>
            </div>

            <div className="modal-actions">
              <button className="modal-btn secundario" onClick={cerrarModal}>
                Cancelar
              </button>
              <button className="modal-btn primario">
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "eliminarEjemplar" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Eliminar ejemplar</h3>
            <p className="modal-texto">
              ¿Estás seguro de que deseas eliminar el siguiente ejemplar?
            </p>

            <div className="modal-libro">
              <strong>{ejemplarSeleccionado?.codigo}</strong>
              <span>{data.titulo}</span>
            </div>

            <div className="modal-actions">
              <button className="modal-btn secundario" onClick={cerrarModal}>
                Cancelar
              </button>
              <button className="modal-btn primario">
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LibroDetalleAdmin