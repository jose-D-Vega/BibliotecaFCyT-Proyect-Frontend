import { useMemo, useState } from "react"
import "./styles/LibroDetalle.css"
import LibroInfoItem from "./LibroInfoItem"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { updateCopyStatus } from "../../services/copies.services"

function LibroDetalleBibliotecario({ libro, ejemplares: ejemplaresProp, onVolver, onRefresh }) {
  const navigate = useNavigate()
  const { rolActivo } = useAuth()

  const rutaBase = rolActivo === "bibliotecario"
    ? "/bibliotecario/catalogo"
    : "/admin/catalogo"

  const [modal, setModal] = useState(null)
  const [ejemplarSeleccionado, setEjemplarSeleccionado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const data = useMemo(() => {
    return libro || {
      id_libro: 0,
      titulo: "Libro de Ejemplo",
      autor: "Autor Ejemplo",
      editorial: "Editorial Ejemplo",
      anio_publicacion: "2023",
      facultad: "Facultad de Ciencias y Tecnologías UNCA",
      ciudad: "Coronel Oviedo",
      carrera: "Informática",
      cantidad_ejemplar: 0
    }
  }, [libro])

  const ejemplares = ejemplaresProp.filter(e => !["eliminado"].includes(e.estado_ejemplar)) || []

  const disponibles = ejemplares.filter(e => e.estado_ejemplar === "disponible").length
  const enPrestamo = ejemplares.filter(e => e.estado_ejemplar === "prestado").length
  const reservados = ejemplares.filter(e => e.estado_ejemplar === "reservado").length
  const inhabilitados = ejemplares.filter(e => e.estado_ejemplar === "inhabilitado").length

  const cerrarModal = () => {
    setModal(null)
    setEjemplarSeleccionado(null)
    setError(null)
  }

  const confirmarInhabilitarEjemplar = async () => {
    try {
      setLoading(true)

      const nuevoEstado = ejemplarSeleccionado.estado_ejemplar === "inhabilitado"
        ? "disponible"
        : "inhabilitado"

      await updateCopyStatus(
        data.id_libro,
        ejemplarSeleccionado.id_ejemplar,
        nuevoEstado
      )

      cerrarModal()
      onRefresh?.()

    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Error al actualizar el ejemplar"
      )
    } finally {
      setLoading(false)
    }
  }

  const manejarModificar = () => {
    navigate(
      `${rutaBase}/${data.id_libro}/editar`,
      {
        state: data
      }
    )
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
              {data.imagen_url
                ? <img src={data.imagen_url} alt="portada" />
                : <div className="portada-placeholder">{data.titulo?.charAt(0)}</div>
              }
            </div>

            <button
              className="admin-action-btn admin-modify-btn"
              onClick={manejarModificar}
            >
              Modificar material
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

              {reservados > 0 &&
                <span className="resumen-badge reservado">
                  {reservados} reservados
                </span>
              }

              {inhabilitados > 0 &&
                <span className="resumen-badge inhabilitado">
                  {inhabilitados} inhabilitados
                </span>
              }
            </div>

            <div className="info-grid">
              <LibroInfoItem label="Autor" value={data.autor} />
              <LibroInfoItem label="Editorial" value={data.editorial} />
              <LibroInfoItem label="Año de publicación" value={data.anio_publicacion} />
              <LibroInfoItem label="Ejemplares" value={data.cantidad_ejemplar} />
              <LibroInfoItem label="Facultad" value={data.facultad} />
              <LibroInfoItem label="Ciudad" value={data.ciudad} />
              <LibroInfoItem label="Carrera" value={data.carrera} full />
            </div>
          </div>
        </section>

        <section className="ejemplares-section">
          <details className="ejemplares-dropdown">
            <summary className="ejemplares-title">
              Ejemplares
            </summary>

            <div className="ejemplares-lista">
              {ejemplares.map((ejemplar) => (
                <div key={ejemplar.id_ejemplar} className="admin-ejemplar-item">
                  <div className="admin-ejemplar-info">
                    <span className="admin-ejemplar-codigo">
                      Ejemplar #{ejemplar.id_ejemplar}
                    </span>
                  </div>

                  <div className="admin-ejemplar-actions">
                    <span className={`admin-ejemplar-estado ${ejemplar.estado_ejemplar}`}>
                      {ejemplar.estado_ejemplar}
                    </span>

                    {ejemplar.estado_ejemplar === "inhabilitado" && (
                      <button
                        className="admin-ejemplar-enable-btn"
                        onClick={() => {
                          setEjemplarSeleccionado(ejemplar)
                          setModal("inhabilitarEjemplar")
                        }}
                      >
                        Habilitar
                      </button>
                    )}

                    {ejemplar.estado_ejemplar === "disponible" && (
                      <button
                        className="admin-ejemplar-disable-btn"
                        onClick={() => {
                          setEjemplarSeleccionado(ejemplar)
                          setModal("inhabilitarEjemplar")
                        }}
                      >
                        Inhabilitar
                      </button>
                    )}

                    {(ejemplar.estado_ejemplar === "prestado" ||
                    ejemplar.estado_ejemplar === "reservado") && (
                      <span className="admin-ejemplar-readonly">
                        Sin acciones disponibles
                      </span>
                    )}

                    {ejemplar.estado_ejemplar === "eliminado" && (
                      <span className="admin-ejemplar-readonly">
                        Eliminado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </section>
      </main>

      {modal === "inhabilitarEjemplar" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">
              {ejemplarSeleccionado?.estado_ejemplar === "inhabilitado"
                ? "Habilitar ejemplar"
                : "Inhabilitar ejemplar"}
            </h3>

            <p className="modal-texto">
              {ejemplarSeleccionado?.estado_ejemplar === "inhabilitado"
                ? "¿Deseas volver a habilitar este ejemplar?"
                : "¿Deseas inhabilitar temporalmente este ejemplar?"}
            </p>

            <div className="modal-libro">
              <strong>
                Ejemplar #{ejemplarSeleccionado?.id_ejemplar}
              </strong>
              <span>{data.titulo}</span>
            </div>

            {error && <p className="modal-error">{error}</p>}

            <div className="modal-actions">
              <button
                className="modal-btn secundario"
                onClick={cerrarModal}
                disabled={loading}
              >
                Cancelar
              </button>

              <button
                className="modal-btn primario"
                onClick={confirmarInhabilitarEjemplar}
                disabled={loading}
              >
                {loading ? "Guardando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LibroDetalleBibliotecario