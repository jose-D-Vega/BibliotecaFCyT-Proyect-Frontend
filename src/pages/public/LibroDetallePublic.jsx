import { useMemo } from "react"
import "../../pages/styles/LibroDetalle.css"

import LibroInfoItem from "../../components/LibroInfoItem"
import EjemplarItem from "../../components/EjemplarItem"

function LibroDetallePublic({ libro, onVolver }) {
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
                <EjemplarItem key={i} ejemplar={ejemplar} />
              ))}
            </div>
          </details>
        </section>
      </main>
    </div>
  )
}

export default LibroDetallePublic