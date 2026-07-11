import { useState, useEffect, useRef } from 'react'
import { getLoanForReturn, registerReturn } from '../../services/returns.services'
import './DevolucionesComponents.css'
import { useNavigate } from 'react-router-dom'
import ModalReservaAfectada from './ModalReservaAfectada'
import ModalSugerirSancion from './ModalSugerirSancion'

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const partes = fecha.split('T')[0].split('-')
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

const ModalDevolucion = ({ id_prestamo, onCerrar, onDevolucionRegistrada }) => {
  const [prestamo, setPrestamo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [devoluciones, setDevoluciones] = useState({})
  const [loadingConfirmar, setLoadingConfirmar] = useState(false)
  const [error, setError] = useState(null)
  const [mensaje, setMensaje] = useState(null)
  const [modal, setModal] = useState(null) // 'sugerirSancion'
  const [sancionInfo, setSancionInfo] = useState(null)
  const [reservasAfectadas, setReservasAfectadas] = useState(null)
  const [resultadoDevolucion, setResultadoDevolucion] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchPrestamo = async () => {
      try {
        const data = await getLoanForReturn(id_prestamo)
        setPrestamo(data)
        const inicial = {}
        data.ejemplares.forEach(e => {
          inicial[e.id_ejemplar] = { seleccionado: false, estado_devuelto: 'bueno', observaciones: '' }
        })
        setDevoluciones(inicial)
      } catch {
        setError('No se pudo cargar el préstamo')
      } finally {
        setLoading(false)
      }
    }
    fetchPrestamo()
  }, [id_prestamo])

  const toggleEjemplar = (id) => {
    setDevoluciones(prev => ({
      ...prev,
      [id]: { ...prev[id], seleccionado: !prev[id].seleccionado }
    }))
  }

  const updateCampo = (id, campo, valor) => {
    setDevoluciones(prev => ({
      ...prev,
      [id]: { ...prev[id], [campo]: valor }
    }))
  }

  const todosSeleccionados = Object.values(devoluciones).every(d => d.seleccionado)
  const algunoSeleccionado = Object.values(devoluciones).some(d => d.seleccionado)
  const cantidadSeleccionada = Object.values(devoluciones).filter(d => d.seleccionado).length

  const toggleTodos = () => {
    setDevoluciones(prev => {
      const updated = {}
      Object.keys(prev).forEach(id => {
        updated[id] = { ...prev[id], seleccionado: !todosSeleccionados }
      })
      return updated
    })
  }

  const handleConfirmar = async () => {
    const seleccionados = Object.entries(devoluciones)
      .filter(([, d]) => d.seleccionado)
      .map(([id, d]) => ({
        id_ejemplar: parseInt(id),
        estado_devuelto: d.estado_devuelto,
        observaciones: d.observaciones
      }))

    try {
      setLoadingConfirmar(true)
      setError(null)
      const result = await registerReturn(id_prestamo, seleccionados)
      setResultadoDevolucion(result.data)
      setMensaje(result.message)
      onDevolucionRegistrada?.()

      // Verificar si algún ejemplar devuelto requiere sanción
      const ejemplaresConProblema = seleccionados.filter(
        s => s.estado_devuelto !== 'bueno'
      )
      const prestamoVencido = prestamo.estado_prestamo === 'vencido'

      const sugerirSancionDespues = () => {
      if (ejemplaresConProblema.length > 0 || prestamoVencido) {
        setModal('sugerirSancion')
        setSancionInfo({
          vencido: prestamoVencido,
          ejemplaresConProblema,
          todosLosEjemplares: seleccionados
        })
        return true
      }
      return false
      }

      // Si hay reservas afectadas por ejemplares dañados/perdidos, gestionarlas primero
      if (result.data.reservas_afectadas?.length > 0) {
        setReservasAfectadas(result.data.reservas_afectadas)
        return // el resto del flujo continúa cuando se cierre ModalReservaAfectada
      }

      if (sugerirSancionDespues()) return

      if (result.data.prestamo_cerrado) {
        setTimeout(() => onCerrar(), 2000)
      } else {
        // Recargar ejemplares restantes
        const data = await getLoanForReturn(id_prestamo)
        setPrestamo(data)
        const nuevo = {}
        data.ejemplares.forEach(e => {
        nuevo[e.id_ejemplar] = { seleccionado: false, estado_devuelto: 'bueno', observaciones: '' }
      })
        setDevoluciones(nuevo)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar la devolución')
    } finally {
      setLoadingConfirmar(false)
    }
  }

  const handleReservasResueltas = async () => {
    setReservasAfectadas(null)

    const seleccionados = Object.entries(devoluciones)
      .filter(([, d]) => d.seleccionado)
      .map(([id, d]) => ({
        id_ejemplar: parseInt(id),
        estado_devuelto: d.estado_devuelto,
        observaciones: d.observaciones
      }))

    const ejemplaresConProblema = seleccionados.filter(s => s.estado_devuelto !== 'bueno')
    const prestamoVencido = prestamo.estado_prestamo === 'vencido'

    if (ejemplaresConProblema.length > 0 || prestamoVencido) {
      setModal('sugerirSancion')
      setSancionInfo({
        vencido: prestamoVencido,
        ejemplaresConProblema,
        todosLosEjemplares: seleccionados
      })
      return
    }

    // Usar prestamo_cerrado del resultado original ya guardado en state
    // en lugar de hacer un nuevo fetch (el segundo fetch falla porque el
    // estado del préstamo ya cambió y getLoanForReturn lo filtraría fuera)
    if (resultadoDevolucion?.prestamo_cerrado) {
      setTimeout(() => onCerrar(), 2000)
    } else {
      // Quedan ejemplares por devolver — recargar (solo funciona si el préstamo sigue activo)
      try {
        const data = await getLoanForReturn(id_prestamo)
        if (!data) { onCerrar(); return }
        setPrestamo(data)
        const nuevo = {}
        data.ejemplares.forEach(e => {
          nuevo[e.id_ejemplar] = { seleccionado: false, estado_devuelto: 'bueno', observaciones: '' }
        })
        setDevoluciones(nuevo)
      } catch {
        onCerrar()
      }
    }
  }

  return (
    <div className="modal-dev-overlay" onClick={onCerrar}>
      <div className="modal-dev-box" onClick={e => e.stopPropagation()}>

        <div className="modal-dev__header">
          <div>
            <h2 className="modal-dev__title">Gestionar devolución</h2>
            {prestamo && (
              <p className="modal-dev__subtitle">
                {prestamo.nombre_apellido} · 
                Prestamo #{
                  prestamo.id_prestamo_original != null ? 
                  prestamo.id_prestamo_original : prestamo.id_prestamo} ·
                Vence {formatFecha(prestamo.fecha_tope_devolucion)}
              </p>
            )}
          </div>
          
        </div>

        {loading && <p className="modal-dev__loading">Cargando...</p>}

        {!loading && prestamo && (
          <>
            {mensaje && (
              <div className="modal-dev__mensaje">✓ {mensaje}</div>
            )}

            <div className="modal-dev__acciones-top">
              <span className="modal-dev__count">
                {cantidadSeleccionada} de {prestamo.ejemplares.length} seleccionados
              </span>
              <button className="modal-dev__select-all" onClick={toggleTodos}>
                {todosSeleccionados ? 'Deseleccionar todos' : 'Seleccionar todos'}
              </button>
            </div>

            <div className="modal-dev__ejemplares">
              {prestamo.ejemplares.map(ejemplar => {
                const dev = devoluciones[ejemplar.id_ejemplar]
                if (!dev) return null
                return (
                  <div
                    key={ejemplar.id_ejemplar}
                    className={`modal-dev__ejemplar ${dev.seleccionado ? 'seleccionado' : ''}`}
                  >
                    <input
                      type="checkbox"
                      id={`modal-ej-${ejemplar.id_ejemplar}`}
                      checked={dev.seleccionado}
                      onChange={() => toggleEjemplar(ejemplar.id_ejemplar)}
                      className="modal-dev__check"
                    />
                    <label htmlFor={`modal-ej-${ejemplar.id_ejemplar}`} className="modal-dev__ejemplar-info">
                      <span className="modal-dev__ej-titulo">{ejemplar.titulo}</span>
                      <span className="modal-dev__ej-autor">{ejemplar.autor}</span>
                      <span className="modal-dev__ej-id">Ejemplar #{ejemplar.id_ejemplar}</span>
                    </label>

                    {dev.seleccionado && (
                      <div className="modal-dev__ej-estado">
                        <div className="dev-estado-group">
                          {[
                            { value: 'bueno', label: 'Buen estado' },
                            { value: 'deteriorado', label: 'Deteriorado' },
                            { value: 'danado', label: 'Dañado' },
                          ].map(op => (
                            <button
                              key={op.value}
                              type="button"
                              className={`dev-estado-btn ${dev.estado_devuelto === op.value ? `active--${op.value}` : ''}`}
                              onClick={() => updateCampo(ejemplar.id_ejemplar, 'estado_devuelto', op.value)}
                            >
                              {op.label}
                            </button>
                          ))}
                        </div>
                        {dev.estado_devuelto !== 'bueno' && (
                          <input
                            type="text"
                            placeholder="Descripción del daño..."
                            value={dev.observaciones}
                            onChange={e => updateCampo(ejemplar.id_ejemplar, 'observaciones', e.target.value)}
                            className="modal-dev__obs"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {error && <p className="modal-dev__error">{error}</p>}

            <div className="modal-dev__footer">
              <button className="modal-dev__btn-cancelar" onClick={onCerrar}>
                Cerrar
              </button>
              <button
                className="modal-dev__btn-confirmar"
                onClick={handleConfirmar}
                disabled={!algunoSeleccionado || loadingConfirmar}
              >
                {loadingConfirmar ? 'Registrando...' : 'Confirmar devolución'}
              </button>
            </div>

            {modal === 'sugerirSancion' && sancionInfo && (
              <ModalSugerirSancion
                sancionInfo={sancionInfo}
                id_prestamo={id_prestamo}
                onCerrar={() => { setModal(null); onCerrar() }}
                // En ModalSugerirSancion, la prop onNavegar recibe (ruta, state)
                // En ModalDevolucion, actualizá el handler así:
                onNavegar={(ruta, state) => navigate(ruta, { state })}
              />
            )}
            {reservasAfectadas && (
              <ModalReservaAfectada
                reservas={reservasAfectadas}
                onResuelto={handleReservasResueltas}
              />
            )}
          </>
        )}

        {error && !prestamo && <p className="modal-dev__error">{error}</p>}
      </div>
    </div>
  )
}

export default ModalDevolucion