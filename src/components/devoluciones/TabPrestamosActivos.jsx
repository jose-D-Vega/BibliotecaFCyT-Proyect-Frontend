import { useState, useEffect, useCallback } from 'react'
import { getAllActiveLoans, searchActiveLoans } from '../../services/returns.services'
import PrestamoActivoCard from './PrestamoActivoCard'
import ModalDevolucion from './ModalDevolucion'
import './DevolucionesComponents.css'

const LIMITE = 12

const TabPrestamosActivos = () => {
  const [search, setSearch] = useState('')
  const [todosLosPrestamos, setTodosLosPrestamos] = useState([]) // cache completo
  const [prestamos, setPrestamos] = useState([])
  const [renovaciones, setRenovaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paginaPrestamos, setPaginaPrestamos] = useState(1)
  const [paginaRenovaciones, setPaginaRenovaciones] = useState(1)
  const [totalPaginasPrestamos, setTotalPaginasPrestamos] = useState(1)
  const [totalPaginasRenovaciones, setTotalPaginasRenovaciones] = useState(1)
  const [modalId, setModalId] = useState(null)
  const [busquedaActiva, setBusquedaActiva] = useState(false)

  const distribuir = (data, paginaP, paginaR) => {
    const normales = data.filter(p => p.numero_renovacion === 0)
    const renov = data.filter(p => p.numero_renovacion > 0)

    const inicioP = (paginaP - 1) * LIMITE
    const inicioR = (paginaR - 1) * LIMITE

    setPrestamos(normales.slice(inicioP, inicioP + LIMITE))
    setRenovaciones(renov.slice(inicioR, inicioR + LIMITE))
    setTotalPaginasPrestamos(Math.max(1, Math.ceil(normales.length / LIMITE)))
    setTotalPaginasRenovaciones(Math.max(1, Math.ceil(renov.length / LIMITE)))
  }

  const cargarTodos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllActiveLoans()
      setTodosLosPrestamos(data)
      distribuir(data, 1, 1)
      setPaginaPrestamos(1)
      setPaginaRenovaciones(1)
      setBusquedaActiva(false)
      setSearch('')
    } catch {
      setError('Error al cargar los préstamos activos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarTodos()
  }, [])

  // Cambio de página préstamos normales
  useEffect(() => {
    if (busquedaActiva) return
    const normales = todosLosPrestamos.filter(p => p.numero_renovacion === 0)
    const inicio = (paginaPrestamos - 1) * LIMITE
    setPrestamos(normales.slice(inicio, inicio + LIMITE))
  }, [paginaPrestamos])

  // Cambio de página renovaciones
  useEffect(() => {
    if (busquedaActiva) return
    const renov = todosLosPrestamos.filter(p => p.numero_renovacion > 0)
    const inicio = (paginaRenovaciones - 1) * LIMITE
    setRenovaciones(renov.slice(inicio, inicio + LIMITE))
  }, [paginaRenovaciones])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!search.trim()) {
      cargarTodos()
      return
    }
    try {
      setLoading(true)
      setError(null)
      const data = await searchActiveLoans(search.trim())
      setTodosLosPrestamos(data)
      distribuir(data, 1, 1)
      setPaginaPrestamos(1)
      setPaginaRenovaciones(1)
      setBusquedaActiva(true)
    } catch {
      setError('Error al buscar préstamos')
    } finally {
      setLoading(false)
    }
  }

  const handleLimpiar = () => {
    cargarTodos()
  }

  const handleDevolucionRegistrada = () => {
    cargarTodos()
  }

  const totalNormales = todosLosPrestamos.filter(p => p.numero_renovacion === 0).length
  const totalRenovaciones = todosLosPrestamos.filter(p => p.numero_renovacion > 0).length

  return (
    <div className="tab-content">
      <form className="tab-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Filtrar por nombre, cédula o correo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="tab-search__input"
        />
        <button type="submit" className="tab-search__btn" disabled={loading}>
          Buscar
        </button>
        {busquedaActiva && (
          <button type="button" className="tab-search__clear" onClick={handleLimpiar}>
            Ver todos
          </button>
        )}
      </form>

      {loading && <p className="tab-loading">Cargando préstamos...</p>}
      {error && <p className="tab-error">{error}</p>}

      {!loading && !error && todosLosPrestamos.length === 0 && (
        <p className="tab-vacio">
          {busquedaActiva ? 'No se encontraron préstamos activos para esa búsqueda.' : 'No hay préstamos activos en este momento.'}
        </p>
      )}

      {!loading && !error && todosLosPrestamos.length > 0 && (
        <>
          {/* Préstamos normales */}
          {totalNormales > 0 && (
            <div className="tab-seccion">
              <h3 className="tab-seccion__titulo">
                Préstamos activos
                <span className="tab-seccion__count">{totalNormales}</span>
              </h3>
              <div className="pcard-grid">
                {prestamos.map(p => (
                  <PrestamoActivoCard
                    key={p.id_prestamo}
                    prestamo={p}
                    onGestionar={(id) => setModalId(id)}
                  />
                ))}
              </div>
              {totalPaginasPrestamos > 1 && (
                <div className="tab-paginacion">
                  {Array.from({ length: totalPaginasPrestamos }, (_, i) => (
                    <button
                      key={i}
                      className={`tab-paginacion__btn ${paginaPrestamos === i + 1 ? 'activo' : ''}`}
                      onClick={() => setPaginaPrestamos(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Renovaciones */}
          {totalRenovaciones > 0 && (
            <div className="tab-seccion">
              <h3 className="tab-seccion__titulo">
                Renovaciones activas
                <span className="tab-seccion__count">{totalRenovaciones}</span>
              </h3>
              <div className="pcard-grid">
                {renovaciones.map(p => (
                  <PrestamoActivoCard
                    key={p.id_prestamo}
                    prestamo={p}
                    onGestionar={(id) => setModalId(id)}
                  />
                ))}
              </div>
              {totalPaginasRenovaciones > 1 && (
                <div className="tab-paginacion">
                  {Array.from({ length: totalPaginasRenovaciones }, (_, i) => (
                    <button
                      key={i}
                      className={`tab-paginacion__btn ${paginaRenovaciones === i + 1 ? 'activo' : ''}`}
                      onClick={() => setPaginaRenovaciones(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {modalId && (
        <ModalDevolucion
          id_prestamo={modalId}
          onCerrar={() => setModalId(null)}
          onDevolucionRegistrada={handleDevolucionRegistrada}
        />
      )}
    </div>
  )
}

export default TabPrestamosActivos