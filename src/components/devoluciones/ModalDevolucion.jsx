import { useState, useEffect } from 'react'
import { getLoanForReturn, registerReturn } from '../../services/returns.services'
import './DevolucionesComponents.css'

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
      setMensaje(result.message)
      onDevolucionRegistrada?.()

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

  return (
    <div className="modal-dev-overlay" onClick={onCerrar}>
      <div className="modal-dev-box" onClick={e => e.stopPropagation()}>

        <div className="modal-dev__header">
          <div>
            <h2 className="modal-dev__title">Gestionar devolución</h2>
            {prestamo && (
              <p className="modal-dev__subtitle">
                {prestamo.nombre_apellido} · #{prestamo.id_prestamo} ·
                Vence {formatFecha(prestamo.fecha_tope_devolucion)}
              </p>
            )}
          </div>
          <button className="modal-dev__cerrar" onClick={onCerrar}>✕</button>
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
                        <select
                          value={dev.estado_devuelto}
                          onChange={e => updateCampo(ejemplar.id_ejemplar, 'estado_devuelto', e.target.value)}
                          className="modal-dev__select"
                        >
                          <option value="bueno">Buen estado</option>
                          <option value="deteriorado">Deteriorado</option>
                          <option value="danado">Dañado</option>
                        </select>
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
          </>
        )}

        {error && !prestamo && <p className="modal-dev__error">{error}</p>}
      </div>
    </div>
  )
}

export default ModalDevolucion