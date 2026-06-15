import { useMemo, useState } from "react"
import { useCart } from '../../context/CartContext'
import "../styles/styles_user/LibroDetalle.css"
import LibroInfoItem from "../../components/LibroInfoItem"
import EjemplarItem from "../../components/EjemplarItem"

function LibroDetalle({ libro, ejemplares: ejemplaresProp, onVolver, onIrAlCarrito }) {
  const { agregarAlCarrito, estaEnCarrito, actualizarCantidad } = useCart()

  const [modal, setModal] = useState(null)
  const [cantidad, setCantidad] = useState(1)

  const data = useMemo(() => libro || {
    id_libro: 0,
    titulo: "Libro de Ejemplo",
    autor: "Autor Ejemplo",
    editorial: "Editorial Ejemplo",
    anio_publicacion: "2023",
    facultad: "Facultad de Ciencias y Tecnologías UNCA",
    ciudad: "Coronel Oviedo",
    carrera: ["Informática"],
    cantidad_ejemplar: 3,
    ejemplares_disponibles: 2
  }, [libro])

  const yaEnCarrito = estaEnCarrito(data.id_libro)

  const ejemplares = ejemplaresProp || []
  const ejemplaresTotal = ejemplares.length
  const disponibles = ejemplares.filter(e => e.estado_ejemplar === "disponible").length
  const enPrestamo = ejemplares.filter(e => e.estado_ejemplar === "prestado").length
  const reservados = ejemplares.filter(e => e.estado_ejemplar === "reservado").length
  const maxSolicitables = disponibles + enPrestamo + reservados

  // Cuántos de la cantidad pedida irían como préstamo vs reserva
  const comoPrestamo = Math.min(cantidad, disponibles)
  const comoReserva = Math.max(0, cantidad - disponibles)

  const areaTexto = Array.isArray(data.carrera)
    ? data.carrera.join(", ")
    : data.carrera

  const abrirConfirmacion = () => {
    setCantidad(1)
    setModal("confirmar")
  }

  const cancelarModal = () => {
    setModal(null)
    setCantidad(1)
  }

  const aceptarAgregar = () => {
    if (yaEnCarrito) {
      actualizarCantidad(data.id_libro, cantidad)
    } else {
      agregarAlCarrito(data, cantidad)
    }
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
        <button className="btn-volver" onClick={onVolver}>← Volver</button>
        <h2 className="header-title">Detalles del libro</h2>
        <button className="carrito-btn-detalle" onClick={onIrAlCarrito}>
          📚 Mis solicitudes
        </button>
      </header>

      <main className="detalle-container">
        <section className="detalle-card">
          <div className="portada-wrapper">
            <div className="portada">
              {data.imagen_url
                ? <img src={data.imagen_url} alt={data.titulo} />
                : <div className="portada-placeholder">{data.titulo?.charAt(0)}</div>
              }
            </div>

            <button
              className="btn-prestamo"
              onClick={abrirConfirmacion}
              disabled={maxSolicitables === 0}
            >
              {yaEnCarrito ? 'Editar solicitud' : 'Solicitar préstamo'}
            </button>
          </div>

          <div className="info">
            <h1 className="titulo-libro">{data.titulo}</h1>

            <div className="resumen-ejemplares">
              <span className="resumen-badge disponible">{disponibles} disponibles</span>
              <span className="resumen-badge prestamo">{enPrestamo} en préstamo</span>
              {reservados > 0 && (
                <span className="resumen-badge reservado">{reservados} reservados</span>
              )}
            </div>

            <div className="info-grid">
              <LibroInfoItem label="Autor" value={data.autor} />
              <LibroInfoItem label="Editorial" value={data.editorial} />
              <LibroInfoItem label="Año de publicación" value={data.anio_publicacion} />
              <LibroInfoItem label="Ejemplares totales" value={ejemplaresTotal} />
              <LibroInfoItem label="Facultad" value={data.facultad} />
              <LibroInfoItem label="Ciudad" value={data.ciudad} />
              <LibroInfoItem label="Área" value={areaTexto} full />
            </div>
          </div>
        </section>

        <section className="ejemplares-section">
          <details className="ejemplares-dropdown">
            <summary className="ejemplares-title">Ejemplares</summary>
            <div className="ejemplares-lista">
              {ejemplares.map((ejemplar, i) => (
                <EjemplarItem key={i} ejemplar={ejemplar} />
              ))}
            </div>
          </details>
        </section>
      </main>

      {/* Modal selector de cantidad */}
      {modal === "confirmar" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">
              {yaEnCarrito ? 'Editar solicitud' : 'Agregar a mis solicitudes'}
            </h3>

            <div className="modal-libro">
              <strong>{data.titulo}</strong>
              <span>{data.autor}</span>
            </div>

            {/* Selector de cantidad */}
            <div className="modal-cantidad-wrapper">
              <label className="modal-cantidad-label">
                Cantidad de ejemplares
              </label>
              <div className="modal-cantidad-control">
                <button
                  className="modal-cantidad-btn"
                  onClick={() => setCantidad(c => Math.max(1, c - 1))}
                  disabled={cantidad <= 1}
                >
                  −
                </button>
                <span className="modal-cantidad-valor">{cantidad}</span>
                <button
                  className="modal-cantidad-btn"
                  onClick={() => setCantidad(c => Math.min(maxSolicitables, c + 1))}
                  disabled={cantidad >= maxSolicitables}
                >
                  +
                </button>
              </div>
              <p className="modal-cantidad-max">
                Máximo disponible: {maxSolicitables} ejemplar{maxSolicitables !== 1 ? 'es' : ''}
              </p>
            </div>

            {/* Distribución préstamo / reserva */}
            <div className="modal-distribucion">
              {comoPrestamo > 0 && (
                <div className="modal-dist-item disponible">
                  <span className="modal-dist-dot" />
                  <span>
                    {comoPrestamo} como <strong>préstamo</strong>
                    {' '}— disponibles para retiro inmediato
                  </span>
                </div>
              )}
              {comoReserva > 0 && (
                <div className="modal-dist-item reserva">
                  <span className="modal-dist-dot" />
                  <span>
                    {comoReserva} como <strong>reserva</strong>
                    {' '}— actualmente en préstamo, se notificará cuando estén disponibles
                  </span>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="modal-btn secundario" onClick={cancelarModal}>
                Cancelar
              </button>
              <button className="modal-btn primario" onClick={aceptarAgregar}>
                {yaEnCarrito ? 'Actualizar' : 'Agregar a mis solicitudes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmación agregado */}
      {modal === "agregado" && (
        <div className="modal-overlay">
          <div className="modal-box">
          <h3 className="modal-title">
            {yaEnCarrito ? 'Solicitud actualizada' : 'Libro agregado a mis solicitudes'}
          </h3>
            <p className="modal-texto">
              {yaEnCarrito
                ? 'Se actualizó la cantidad solicitada correctamente.'
                : 'Se agregó correctamente a mis solicitudes:'
              }
            </p>

            <div className="modal-libro">
              <strong>{data.titulo}</strong>
              <span>{data.autor}</span>
            </div>

            <div className="modal-distribucion">
              {comoPrestamo > 0 && (
                <div className="modal-dist-item disponible">
                  <span className="modal-dist-dot" />
                  <span>{comoPrestamo} como <strong>préstamo</strong></span>
                </div>
              )}
              {comoReserva > 0 && (
                <div className="modal-dist-item reserva">
                  <span className="modal-dist-dot" />
                  <span>{comoReserva} como <strong>reserva</strong></span>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="modal-btn secundario" onClick={seguirViendoCatalogo}>
                Seguir viendo catálogo
              </button>
              <button className="modal-btn primario" onClick={irAlCarrito}>
                Ir a mis solicitudes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LibroDetalle
