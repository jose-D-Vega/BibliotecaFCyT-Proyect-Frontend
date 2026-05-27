import { useState } from 'react'
import { searchActiveLoans, getLoanForReturn, registerReturn } from '../../../services/returns.services'
import './AdminDevolucionesPage.css'

const ESTADO_PRESTAMO_LABELS = {
  activo: 'Activo',
  pendiente_devolucion: 'Pendiente de devolución'
}

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const partes = fecha.split('T')[0].split('-')
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

const AdminDevolucionesPage = () => {
  const [search, setSearch] = useState('')
  const [resultados, setResultados] = useState([])
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [errorSearch, setErrorSearch] = useState(null)

  const [prestamoActivo, setPrestamoActivo] = useState(null)
  const [loadingPrestamo, setLoadingPrestamo] = useState(false)

  const [devoluciones, setDevoluciones] = useState({})
  const [loadingDevolucion, setLoadingDevolucion] = useState(false)
  const [errorDevolucion, setErrorDevolucion] = useState(null)
  const [resultado, setResultado] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (search.trim().length < 2) return
    try {
      setLoadingSearch(true)
      setErrorSearch(null)
      setPrestamoActivo(null)
      setResultado(null)
      const data = await searchActiveLoans(search.trim())
      setResultados(data)
    } catch {
      setErrorSearch('Error al buscar préstamos')
    } finally {
      setLoadingSearch(false)
    }
  }

  const handleSeleccionarPrestamo = async (id_prestamo) => {
    try {
      setLoadingPrestamo(true)
      setErrorDevolucion(null)
      setResultado(null)
      const data = await getLoanForReturn(id_prestamo)
      setPrestamoActivo(data)
      // Inicializar estado de devolución para cada ejemplar
      const estadoInicial = {}
      data.ejemplares.forEach(e => {
        estadoInicial[e.id_ejemplar] = {
          seleccionado: false,
          estado_devuelto: 'bueno',
          observaciones: ''
        }
      })
      setDevoluciones(estadoInicial)
    } catch {
      setErrorDevolucion('Error al cargar el préstamo')
    } finally {
      setLoadingPrestamo(false)
    }
  }

  const toggleEjemplar = (id_ejemplar) => {
    setDevoluciones(prev => ({
      ...prev,
      [id_ejemplar]: {
        ...prev[id_ejemplar],
        seleccionado: !prev[id_ejemplar].seleccionado
      }
    }))
  }

  const updateEstado = (id_ejemplar, campo, valor) => {
    setDevoluciones(prev => ({
      ...prev,
      [id_ejemplar]: { ...prev[id_ejemplar], [campo]: valor }
    }))
  }

  const handleConfirmar = async () => {
    const seleccionados = Object.entries(devoluciones)
      .filter(([, dev]) => dev.seleccionado)
      .map(([id_ejemplar, dev]) => ({
        id_ejemplar: parseInt(id_ejemplar),
        estado_devuelto: dev.estado_devuelto,
        observaciones: dev.observaciones
      }))

    if (seleccionados.length === 0) {
      setErrorDevolucion('Seleccioná al menos un ejemplar para devolver')
      return
    }

    try {
      setLoadingDevolucion(true)
      setErrorDevolucion(null)
      const data = await registerReturn(prestamoActivo.id_prestamo, seleccionados)
      setResultado(data)

      if (data.data.prestamo_cerrado) {
        // Préstamo cerrado — limpiar todo
        setPrestamoActivo(null)
        setResultados(prev => prev.filter(p => p.id_prestamo !== prestamoActivo.id_prestamo))
      } else {
        // Quedan ejemplares — recargar el préstamo
        await handleSeleccionarPrestamo(prestamoActivo.id_prestamo)
      }
    } catch (err) {
      setErrorDevolucion(err.response?.data?.error || 'Error al registrar la devolución')
    } finally {
      setLoadingDevolucion(false)
    }
  }

  const todosSeleccionados = Object.values(devoluciones).every(d => d.seleccionado)
  const algunoSeleccionado = Object.values(devoluciones).some(d => d.seleccionado)

  const toggleTodos = () => {
    setDevoluciones(prev => {
      const updated = {}
      Object.keys(prev).forEach(id => {
        updated[id] = { ...prev[id], seleccionado: !todosSeleccionados }
      })
      return updated
    })
  }

  return (
    <div className="devoluciones-page">
      <h1 className="devoluciones-page__title">Devoluciones</h1>

      {/* Buscador */}
      <div className="devoluciones-search">
        <form onSubmit={handleSearch} className="devoluciones-search__form">
          <input
            type="text"
            placeholder="Buscar por nombre, cédula o correo del usuario..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="devoluciones-search__input"
          />
          <button type="submit" className="devoluciones-search__btn" disabled={loadingSearch}>
            {loadingSearch ? 'Buscando...' : 'Buscar'}
          </button>
        </form>
        {errorSearch && <p className="devoluciones-error">{errorSearch}</p>}
      </div>

      <div className="devoluciones-content">

        {/* Resultados de búsqueda */}
        {resultados.length > 0 && (
          <div className="devoluciones-resultados">
            <h2 className="devoluciones-section__title">Préstamos activos</h2>
            {resultados.map(prestamo => (
              <div
                key={prestamo.id_prestamo}
                className={`devoluciones-resultado-item ${prestamoActivo?.id_prestamo === prestamo.id_prestamo ? 'activo' : ''}`}
                onClick={() => handleSeleccionarPrestamo(prestamo.id_prestamo)}
              >
                <div className="devoluciones-resultado-item__info">
                  <span className="devoluciones-resultado-item__nombre">
                    {prestamo.nombre_apellido}
                  </span>
                  <span className="devoluciones-resultado-item__detalle">
                    {prestamo.correo} · CI: {prestamo.ci}
                  </span>
                  <span className="devoluciones-resultado-item__detalle">
                    Préstamo #{prestamo.id_prestamo} ·{' '}
                    {prestamo.ejemplares_pendientes} ejemplar{prestamo.ejemplares_pendientes > 1 ? 'es' : ''} pendiente{prestamo.ejemplares_pendientes > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="devoluciones-resultado-item__meta">
                  <span className={`devoluciones-estado estado-${prestamo.estado_prestamo}`}>
                    {ESTADO_PRESTAMO_LABELS[prestamo.estado_prestamo] || prestamo.estado_prestamo}
                  </span>
                  <span className={`devoluciones-fecha ${new Date(prestamo.fecha_tope_devolucion) < new Date() ? 'vencida' : ''}`}>
                    Vence {formatFecha(prestamo.fecha_tope_devolucion)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {resultados.length === 0 && search && !loadingSearch && (
          <p className="devoluciones-vacio">No se encontraron préstamos activos para esa búsqueda.</p>
        )}

        {/* Panel de devolución */}
        {loadingPrestamo && <p className="devoluciones-loading">Cargando préstamo...</p>}

        {prestamoActivo && !loadingPrestamo && (
          <div className="devoluciones-panel">
            <div className="devoluciones-panel__header">
              <div>
                <h2 className="devoluciones-section__title">
                  Registrar devolución — Préstamo #{prestamoActivo.id_prestamo}
                </h2>
                <p className="devoluciones-panel__usuario">
                  {prestamoActivo.nombre_apellido} · {prestamoActivo.correo}
                </p>
              </div>
              <button className="devoluciones-select-all" onClick={toggleTodos}>
                {todosSeleccionados ? 'Deseleccionar todos' : 'Seleccionar todos'}
              </button>
            </div>

            {resultado && (
              <div className="devoluciones-resultado-msg">
                ✓ {resultado.message}
              </div>
            )}

            <div className="devoluciones-ejemplares">
              {prestamoActivo.ejemplares.map(ejemplar => {
                const dev = devoluciones[ejemplar.id_ejemplar]
                if (!dev) return null
                return (
                  <div
                    key={ejemplar.id_ejemplar}
                    className={`devoluciones-ejemplar ${dev.seleccionado ? 'seleccionado' : ''}`}
                  >
                    <div className="devoluciones-ejemplar__check">
                      <input
                        type="checkbox"
                        checked={dev.seleccionado}
                        onChange={() => toggleEjemplar(ejemplar.id_ejemplar)}
                        id={`ej-${ejemplar.id_ejemplar}`}
                      />
                    </div>

                    <label
                      htmlFor={`ej-${ejemplar.id_ejemplar}`}
                      className="devoluciones-ejemplar__info"
                    >
                      <span className="devoluciones-ejemplar__titulo">{ejemplar.titulo}</span>
                      <span className="devoluciones-ejemplar__autor">{ejemplar.autor}</span>
                      <span className="devoluciones-ejemplar__id">Ejemplar #{ejemplar.id_ejemplar}</span>
                    </label>

                    {dev.seleccionado && (
                      <div className="devoluciones-ejemplar__estado">
                        <select
                          value={dev.estado_devuelto}
                          onChange={e => updateEstado(ejemplar.id_ejemplar, 'estado_devuelto', e.target.value)}
                          className="devoluciones-select"
                        >
                          <option value="bueno">Buen estado</option>
                          <option value="deteriorado">Deteriorado</option>
                          <option value="danado">Dañado</option>
                        </select>
                        {dev.estado_devuelto !== 'bueno' && (
                          <input
                            type="text"
                            placeholder="Observaciones del daño..."
                            value={dev.observaciones}
                            onChange={e => updateEstado(ejemplar.id_ejemplar, 'observaciones', e.target.value)}
                            className="devoluciones-obs-input"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {errorDevolucion && <p className="devoluciones-error">{errorDevolucion}</p>}

            <div className="devoluciones-panel__footer">
              <span className="devoluciones-panel__count">
                {Object.values(devoluciones).filter(d => d.seleccionado).length} de{' '}
                {prestamoActivo.ejemplares.length} ejemplares seleccionados
              </span>
              <button
                className="devoluciones-confirmar-btn"
                onClick={handleConfirmar}
                disabled={!algunoSeleccionado || loadingDevolucion}
              >
                {loadingDevolucion ? 'Registrando...' : 'Confirmar devolución'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDevolucionesPage