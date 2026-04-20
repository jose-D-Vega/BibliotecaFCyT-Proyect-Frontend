import { useMemo, useState } from "react"
import "../../pages/styles/LibroDetalle.css"

import LibroInfoItem from "../../components/LibroInfoItem"
import EjemplarItem from "../../components/EjemplarItem"

function LibroDetalle({ libro, onVolver, onIrAlCarrito, onAgregarAlCarrito }) {
  const [modal, setModal] = useState(null)

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

  const abrirConfirmacion = () => {
    setModal("confirmar")
  }

  const cancelarModal = () => {
    setModal(null)
  }

  const aceptarAgregar = () => {
    onAgregarAlCarrito?.(data)
    setModal("agregado")
  }

  const seguirViendoCatalogo = () => {
    setModal(null)
    onVolver?.()
  }

  const irAlCarrito = () => {
    setModal(null)
    onIrAlCarrito?.()
  }

  return (
    <div className="detalle-page">
      <header className="detalle-header">
        <button className="btn-volver" onClick={onVolver}>
          ← Volver
        </button>

        <h2 className="header-title">Detalles del libro</h2>

        <button className="carrito-btn-detalle" onClick={onIrAlCarrito}>
          🛒 Carrito
        </button>
      </header>

      <main className="detalle-container">
        <section className="detalle-card">
          <div className="portada-wrapper">
            <div className="portada">
              <img src={data.imagen} alt="portada" />
            </div>

            <button className="btn-prestamo" onClick={abrirConfirmacion}>
              Solicitar préstamo
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
                <EjemplarItem key={i} ejemplar={ejemplar} />
              ))}
            </div>
          </details>
        </section>
      </main>

      {modal === "confirmar" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Agregar al carrito de préstamos</h3>
            <p className="modal-texto">
              ¿Deseas agregar al carrito de préstamos el siguiente libro?
            </p>

            <div className="modal-libro">
              <strong>{data.titulo}</strong>
              <span>{data.autor}</span>
            </div>

            <div className="modal-actions">
              <button className="modal-btn secundario" onClick={cancelarModal}>
                Cancelar
              </button>
              <button className="modal-btn primario" onClick={aceptarAgregar}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "agregado" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Libro agregado al carrito</h3>
            <p className="modal-texto">
              Se agregó correctamente el siguiente libro al carrito de préstamos:
            </p>

            <div className="modal-libro">
              <strong>{data.titulo}</strong>
              <span>{data.autor}</span>
            </div>

            <div className="modal-actions">
              <button
                className="modal-btn secundario"
                onClick={seguirViendoCatalogo}
              >
                Seguir viendo catálogo
              </button>
              <button className="modal-btn primario" onClick={irAlCarrito}>
                Ir al carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LibroDetalle