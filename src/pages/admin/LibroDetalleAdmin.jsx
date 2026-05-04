import { useMemo, useState } from "react"
import "../../pages/styles/LibroDetalle.css"
import "../../pages/styles/LibroDetalleAdmin.css"
import LibroInfoItem from "../../components/LibroInfoItem"
import { useNavigate } from "react-router-dom"
import { deleteBook } from "../../services/books.services"
import { deleteCopy } from "../../services/copies.services"

function LibroDetalleAdmin({ libro, ejemplares: ejemplaresProp, onVolver, onRefresh }) {
  const [modal, setModal] = useState(null)
  const [ejemplarSeleccionado, setEjemplarSeleccionado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

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

  const ejemplares = ejemplaresProp || []
  const ejemplaresTotal = ejemplares.length
  const disponibles = ejemplares.filter(e => e.estado_ejemplar === "disponible").length
  const enPrestamo = ejemplares.filter(e => e.estado_ejemplar === "prestado").length
  const reservados = ejemplares.filter(e => e.estado_ejemplar === "reservado").length

  const abrirEliminarMaterial = () => setModal("eliminarMaterial")

  const abrirEliminarEjemplar = (ejemplar) => {
    setEjemplarSeleccionado(ejemplar)
    setModal("eliminarEjemplar")
  }

  const cerrarModal = () => {
    setModal(null)
    setEjemplarSeleccionado(null)
    setError(null)
  }

  const confirmarEliminarLibro = async () => {
    try {
      setLoading(true)
      await deleteBook(data.id_libro)
      navigate('/admin/catalogo', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar el libro')
    } finally {
      setLoading(false)
    }
  }

  const confirmarEliminarEjemplar = async () => {
    try {
      setLoading(true)
      await deleteCopy(data.id_libro, ejemplarSeleccionado.id_ejemplar)
      cerrarModal()
      onRefresh?.()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar el ejemplar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="detalle-page">
      <header className="detalle-header">
        <button className="btn-volver" onClick={onVolver}>← Volver</button>
        <h2 className="header-title">Detalles del libro</h2>
        <button onClick={() => navigate(`/admin/catalogo/${data.id_libro}/editar`)}>
          Editar libro
        </button>
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
              className="admin-action-btn admin-delete-material-btn"
              onClick={abrirEliminarMaterial}
            >
              Eliminar material
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
              <LibroInfoItem label="Ejemplares" value={data.cantidad_ejemplar} />
              <LibroInfoItem label="Facultad" value={data.facultad} />
              <LibroInfoItem label="Ciudad" value={data.ciudad} />
              <LibroInfoItem label="Carrera" value={data.carrera} full />
            </div>
          </div>
        </section>

        <section className="ejemplares-section">
          <details className="ejemplares-dropdown">
            <summary className="ejemplares-title">Ejemplares</summary>
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
                    {ejemplar.estado_ejemplar !== 'prestado' && ejemplar.estado_ejemplar !== 'reservado' && (
                      <button
                        className="admin-ejemplar-delete-btn"
                        onClick={() => abrirEliminarEjemplar(ejemplar)}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </section>
      </main>

      {/* Modal eliminar libro */}
      {modal === "eliminarMaterial" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Eliminar material</h3>
            <p className="modal-texto">¿Estás seguro de que deseas eliminar este material?</p>
            <div className="modal-libro">
              <strong>{data.titulo}</strong>
              <span>{data.autor}</span>
            </div>
            {error && <p style={{ color: '#a32d2d', fontSize: '0.875rem' }}>{error}</p>}
            <div className="modal-actions">
              <button className="modal-btn secundario" onClick={cerrarModal} disabled={loading}>
                Cancelar
              </button>
              <button className="modal-btn primario" onClick={confirmarEliminarLibro} disabled={loading}>
                {loading ? 'Eliminando...' : 'Aceptar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminar ejemplar */}
      {modal === "eliminarEjemplar" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Eliminar ejemplar</h3>
            <p className="modal-texto">¿Estás seguro de que deseas eliminar este ejemplar?</p>
            <div className="modal-libro">
              <strong>Ejemplar #{ejemplarSeleccionado?.id_ejemplar}</strong>
              <span>{data.titulo}</span>
            </div>
            {error && <p style={{ color: '#a32d2d', fontSize: '0.875rem' }}>{error}</p>}
            <div className="modal-actions">
              <button className="modal-btn secundario" onClick={cerrarModal} disabled={loading}>
                Cancelar
              </button>
              <button className="modal-btn primario" onClick={confirmarEliminarEjemplar} disabled={loading}>
                {loading ? 'Eliminando...' : 'Aceptar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LibroDetalleAdmin