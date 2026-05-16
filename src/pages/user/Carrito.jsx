import { useState } from "react"
import { useCart } from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { createLoan } from '../../services/loans.services'
import "../styles/styles_user/Carrito.css"

function CarritoPage() {
  const {
    carrito,
    actualizarCantidad,
    removerDelCarrito,
    vaciarCarrito,
    calcularDistribucion,
    buildPayload,
    hayReservas
  } = useCart()

  const navigate = useNavigate()
  const [modal, setModal] = useState(null) // 'confirmar' | 'exito' | 'error'
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [advertencias, setAdvertencias] = useState([])
  const [resultadoExito, setResultadoExito] = useState(null)

  const totalEjemplares = carrito.reduce((acc, item) => acc + item.cantidad, 0)

  const handleConfirmar = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const items = buildPayload()
      const result = await createLoan(items)
      setResultadoExito(result.data)
      setAdvertencias(result.data.advertencias || [])
      vaciarCarrito()
      setModal('exito')
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Error al procesar la solicitud')
      setModal('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="carrito-page">
      <header className="carrito-header">
        <button className="carrito-volver-btn" onClick={() => navigate('/app/catalogo')}>
          ← Volver al catálogo
        </button>
        <h1 className="carrito-titulo">Carrito de Préstamos</h1>
      </header>

      <main className="carrito-container">
        {carrito.length > 0 ? (
          <>
            {hayReservas && (
              <div className="carrito-aviso">
                <span className="carrito-aviso-dot" />
                <p>
                  Algunos ejemplares están actualmente en préstamo y se procesarán
                  como <strong>reserva</strong>. Se te notificará cuando estén disponibles.
                </p>
              </div>
            )}

            <div className="carrito-tabla-wrapper">
              <div className="carrito-tabla-body-wrapper">
                <table className="carrito-tabla">
                  <thead>
                    <tr>
                      <th className="col-portada"></th>
                      <th className="col-libro">Libro</th>
                      <th className="col-cantidad">Cantidad</th>
                      <th className="col-distribucion">Distribución</th>
                      <th className="col-acciones">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map(item => {
                      const { prestamo, reserva } = calcularDistribucion(item)
                      const maxSolicitables = item.ejemplares_disponibles + item.ejemplares_reservables

                      return (
                        <tr key={item.id_libro} className="carrito-fila">
                          <td className="col-portada">
                            <div className="carrito-portada">
                              {item.imagen_url
                                ? <img src={item.imagen_url} alt={item.titulo} />
                                : <span className="carrito-portada-inicial">
                                    {item.titulo?.charAt(0)}
                                  </span>
                              }
                            </div>
                          </td>

                          <td className="col-libro">
                            <div className="carrito-libro-info">
                              <span className="carrito-libro-titulo">{item.titulo}</span>
                              <span className="carrito-libro-autor">{item.autor}</span>
                            </div>
                          </td>

                          <td className="col-cantidad">
                            <div className="carrito-cantidad-control">
                              <button
                                className="carrito-cantidad-btn"
                                onClick={() => actualizarCantidad(item.id_libro, item.cantidad - 1)}
                                disabled={item.cantidad <= 1}
                              >−</button>
                              <span className="carrito-cantidad-valor">{item.cantidad}</span>
                              <button
                                className="carrito-cantidad-btn"
                                onClick={() => actualizarCantidad(item.id_libro, item.cantidad + 1)}
                                disabled={item.cantidad >= maxSolicitables}
                              >+</button>
                            </div>
                          </td>

                          <td className="col-distribucion">
                            <div className="carrito-dist">
                              {prestamo > 0 && (
                                <span className="carrito-dist-badge prestamo">
                                  {prestamo} préstamo
                                </span>
                              )}
                              {reserva > 0 && (
                                <span className="carrito-dist-badge reserva">
                                  {reserva} reserva
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="col-acciones">
                            <div className="carrito-acciones-fila">
                              <button
                                className="carrito-detalle-btn"
                                onClick={() => navigate(`/app/catalogo/${item.id_libro}`)}
                              >
                                Ver detalle
                              </button>
                              <button
                                className="carrito-remover-btn"
                                onClick={() => removerDelCarrito(item.id_libro)}
                              >
                                Remover
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer siempre visible */}
            <div className="carrito-footer">
              <div className="carrito-resumen">
                <span className="carrito-resumen-label">Total de ejemplares</span>
                <span className="carrito-resumen-valor">{totalEjemplares}</span>
              </div>
              <div className="carrito-acciones">
                <button className="carrito-accion-btn secundario" onClick={vaciarCarrito}>
                  Vaciar carrito
                </button>
                <button
                  className="carrito-accion-btn primario"
                  onClick={() => setModal('confirmar')}
                >
                  Confirmar solicitud
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="carrito-vacio">
            <h2>Tu carrito está vacío</h2>
            <p>No hay libros agregados al carrito de préstamos por el momento.</p>
            <button
              className="carrito-accion-btn primario"
              onClick={() => navigate('/app/catalogo')}
              style={{ marginTop: '20px' }}
            >
              Ir al catálogo
            </button>
          </div>
        )}
      </main>

      {/* Modal confirmar */}
      {modal === 'confirmar' && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Confirmar solicitud</h3>
            <p className="modal-texto">
              Estás por solicitar <strong>{totalEjemplares} ejemplar{totalEjemplares !== 1 ? 'es' : ''}</strong> de {carrito.length} libro{carrito.length !== 1 ? 's' : ''}.
            </p>

            <div className="modal-resumen-lista">
              {carrito.map(item => {
                const { prestamo, reserva } = calcularDistribucion(item)
                return (
                  <div key={item.id_libro} className="modal-resumen-item">
                    <div className="modal-resumen-info">
                      <span className="modal-resumen-titulo">{item.titulo}</span>
                      <span className="modal-resumen-autor">{item.autor}</span>
                    </div>
                    <div className="modal-resumen-dist">
                      {prestamo > 0 && (
                        <span className="carrito-dist-badge prestamo">{prestamo} préstamo</span>
                      )}
                      {reserva > 0 && (
                        <span className="carrito-dist-badge reserva">{reserva} reserva</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {hayReservas && (
              <p className="modal-aviso-reserva">
                Los ejemplares marcados como reserva quedarán en espera hasta que estén disponibles.
              </p>
            )}

            <div className="modal-actions">
              <button
                className="modal-btn secundario"
                onClick={() => setModal(null)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                className="modal-btn primario"
                onClick={handleConfirmar}
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal éxito */}
      {modal === 'exito' && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Solicitud enviada</h3>
            <p className="modal-texto">
              Tu solicitud fue procesada correctamente. El bibliotecario la revisará a la brevedad.
            </p>

            {resultadoExito?.prestamo && (
              <div className="modal-resultado-item prestamo">
                <span className="carrito-dist-badge prestamo">Préstamo</span>
                <span>Solicitud #{resultadoExito.prestamo.id_prestamo} — pendiente de aprobación</span>
              </div>
            )}
            {resultadoExito?.reserva && (
              <div className="modal-resultado-item reserva">
                <span className="carrito-dist-badge reserva">Reserva</span>
                <span>Solicitud #{resultadoExito.reserva.id_prestamo} — en espera de disponibilidad</span>
              </div>
            )}

            {advertencias.length > 0 && (
              <div className="modal-advertencias">
                {advertencias.map((adv, i) => (
                  <p key={i} className="modal-advertencia-item">{adv}</p>
                ))}
              </div>
            )}

            <div className="modal-actions">
              <button
                className="modal-btn secundario"
                onClick={() => navigate('/app/prestamos')}
              >
                Ver mis préstamos
              </button>
              <button
                className="modal-btn primario"
                onClick={() => navigate('/app/catalogo')}
              >
                Volver al catálogo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal error */}
      {modal === 'error' && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Error en la solicitud</h3>
            <p className="modal-texto">{errorMsg}</p>
            <div className="modal-actions">
              <button
                className="modal-btn primario"
                onClick={() => setModal(null)}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CarritoPage
