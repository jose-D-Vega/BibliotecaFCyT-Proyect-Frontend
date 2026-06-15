import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getLoanForSanction, searchSanctionableLoans, createSanction } from '../../../services/sanctions.services'
import { searchUsers } from '../../../services/users.services'
import './NuevaSancionPage.css'

// Tipos de infracción disponibles
const TIPOS = [
  { value: 'falta_entrega', label: 'Falta de entrega', desc: 'El usuario no devolvió el material y el préstamo está vencido' },
  { value: 'devolucion_tardia', label: 'Devolución tardía', desc: 'El usuario devolvió el material fuera del plazo establecido' },
  { value: 'deterioro', label: 'Material dañado', desc: 'El material fue devuelto en mal estado' },
  { value: 'perdida', label: 'Material perdido', desc: 'El usuario extravió el material prestado' },
  { value: 'comportamiento', label: 'Comportamiento inadecuado', desc: 'El usuario incumplió las normas de la biblioteca' },
]

// Reglas por tipo de infracción
const REQUIERE_PRESTAMO = (tipo) => tipo !== 'comportamiento'
const REQUIERE_EJEMPLAR = (tipo) => ['devolucion_tardia', 'deterioro', 'perdida'].includes(tipo)
// Para devolución tardía, una misma descripción aplica a todos los ejemplares seleccionados.
// Para deterioro y pérdida, cada ejemplar necesita su propia descripción.
const DESCRIPCION_POR_EJEMPLAR = (tipo) => ['deterioro', 'perdida'].includes(tipo)
const DESCRIPCION_OBLIGATORIA = (tipo) => tipo !== 'falta_entrega'

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const partes = fecha.split('T')[0].split('-')
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

const NuevaSancionPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const idPrestamoInicial = searchParams.get('id_prestamo')
  const idEjemplaresInicial = searchParams.get('id_ejemplares') // "1,2,3"
  const tipoSugerido = searchParams.get('tipo')
  const idUsuarioInicial = searchParams.get('id_usuario')

  // Tipo de infracción seleccionado
  const [tipoInfraccion, setTipoInfraccion] = useState(tipoSugerido || '')

  // Préstamo seleccionado (con ejemplares)
  const [prestamo, setPrestamo] = useState(null)
  const [loadingPrestamo, setLoadingPrestamo] = useState(!!idPrestamoInicial)

  // Usuario seleccionado (para comportamiento sin préstamo)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)

  // Buscadores
  const [busquedaPrestamo, setBusquedaPrestamo] = useState('')
  const [resultadosPrestamo, setResultadosPrestamo] = useState([])
  const [buscandoPrestamo, setBuscandoPrestamo] = useState(false)

  const [busquedaUsuario, setBusquedaUsuario] = useState('')
  const [resultadosUsuario, setResultadosUsuario] = useState([])
  const [buscandoUsuario, setBuscandoUsuario] = useState(false)

  // Formulario
  const [ejemplaresSeleccionados, setEjemplaresSeleccionados] = useState(
    idEjemplaresInicial ? idEjemplaresInicial.split(',').map(Number) : []
  )
  const [descripcionGeneral, setDescripcionGeneral] = useState('')
  const [descripcionesPorEjemplar, setDescripcionesPorEjemplar] = useState({}) // { id_ejemplar: texto }
  const [diasSuspension, setDiasSuspension] = useState('')
  const [suspensionIndefinida, setSuspensionIndefinida] = useState(false)

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Modales
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [mostrarExito, setMostrarExito] = useState(false)

  // ── Cargar préstamo inicial (si vino por query param) ──
  useEffect(() => {
    if (!idPrestamoInicial) return
    const fetchPrestamo = async () => {
      try {
        setLoadingPrestamo(true)
        const data = await getLoanForSanction(idPrestamoInicial)
        setPrestamo(data)
      } catch {
        setError('No se pudo cargar el préstamo indicado')
      } finally {
        setLoadingPrestamo(false)
      }
    }
    fetchPrestamo()
  }, [idPrestamoInicial])

  // Si cambia el tipo y deja de requerir ejemplares, limpiamos selección/descripciones
  useEffect(() => {
    if (!REQUIERE_EJEMPLAR(tipoInfraccion)) {
      setEjemplaresSeleccionados([])
      setDescripcionesPorEjemplar({})
    }
    if (tipoInfraccion !== 'comportamiento') {
      setDiasSuspension('')
      setSuspensionIndefinida(false)
    }
    setError(null)
  }, [tipoInfraccion])

  // ── Buscar préstamos sancionables ──
  const buscarPrestamos = useCallback(async () => {
    if (!busquedaPrestamo.trim() || !tipoInfraccion) return
    try {
      setBuscandoPrestamo(true)
      setError(null)
      const data = await searchSanctionableLoans(busquedaPrestamo.trim(), tipoInfraccion)
      setResultadosPrestamo(data)
    } catch {
      setError('Error al buscar préstamos')
    } finally {
      setBuscandoPrestamo(false)
    }
  }, [busquedaPrestamo, tipoInfraccion])

  const seleccionarPrestamo = async (p) => {
    try {
      setLoadingPrestamo(true)
      setResultadosPrestamo([])
      setBusquedaPrestamo('')
      const data = await getLoanForSanction(p.id_prestamo)
      setPrestamo(data)
      setEjemplaresSeleccionados([])
      setDescripcionesPorEjemplar({})
    } catch {
      setError('No se pudo cargar el préstamo seleccionado')
    } finally {
      setLoadingPrestamo(false)
    }
  }

  const quitarPrestamo = () => {
    setPrestamo(null)
    setEjemplaresSeleccionados([])
    setDescripcionesPorEjemplar({})
  }

  // ── Buscar usuarios (comportamiento sin préstamo) ──
  const buscarUsuarios = useCallback(async () => {
    if (!busquedaUsuario.trim()) return
    try {
      setBuscandoUsuario(true)
      setError(null)
      const data = await searchUsers(busquedaUsuario.trim())
      setResultadosUsuario(data)
    } catch {
      setError('Error al buscar usuarios')
    } finally {
      setBuscandoUsuario(false)
    }
  }, [busquedaUsuario])

  const seleccionarUsuario = (u) => {
    setUsuarioSeleccionado(u)
    setResultadosUsuario([])
    setBusquedaUsuario('')
  }

  const quitarUsuario = () => setUsuarioSeleccionado(null)

  // ── Helpers de selección de ejemplares ──
  const toggleEjemplar = (id_ejemplar) => {
    setEjemplaresSeleccionados(prev =>
      prev.includes(id_ejemplar)
        ? prev.filter(id => id !== id_ejemplar)
        : [...prev, id_ejemplar]
    )
  }

  // ── Determinar id_usuario efectivo ──
  const idUsuarioEfectivo = () => {
    if (tipoInfraccion === 'comportamiento') {
      return prestamo?.id_usuario || usuarioSeleccionado?.id_usuario || idUsuarioInicial || null
    }
    return prestamo?.id_usuario || idUsuarioInicial || null
  }

  // ── Validación del formulario ──
  const validar = () => {
    if (!tipoInfraccion) return 'Seleccioná el tipo de infracción'

    if (REQUIERE_PRESTAMO(tipoInfraccion) && !prestamo) {
      return 'Seleccioná un préstamo para sancionar'
    }

    if (!idUsuarioEfectivo()) {
      return tipoInfraccion === 'comportamiento'
        ? 'Seleccioná el usuario a sancionar'
        : 'No se pudo determinar el usuario del préstamo'
    }

    if (REQUIERE_EJEMPLAR(tipoInfraccion) && ejemplaresSeleccionados.length === 0) {
      return 'Seleccioná al menos un ejemplar'
    }

    if (DESCRIPCION_OBLIGATORIA(tipoInfraccion)) {
      if (DESCRIPCION_POR_EJEMPLAR(tipoInfraccion)) {
        const faltantes = ejemplaresSeleccionados.filter(
          id => !descripcionesPorEjemplar[id]?.trim()
        )
        if (faltantes.length > 0) {
          return 'Ingresá una descripción para cada ejemplar seleccionado'
        }
      } else if (!descripcionGeneral.trim()) {
        return 'Ingresá una descripción de la sanción'
      }
    }

    if (tipoInfraccion === 'comportamiento' && !suspensionIndefinida && !diasSuspension) {
      return 'Ingresá los días de suspensión o marcá la sanción como indefinida'
    }

    return null
  }

  // ── Construir el o los payloads a enviar ──
  const construirPayloads = () => {
    const id_usuario = idUsuarioEfectivo()

    if (tipoInfraccion === 'comportamiento') {
      return [{
        id_prestamo: prestamo?.id_prestamo || null,
        id_ejemplar: null,
        id_usuario,
        tipo_infraccion: 'comportamiento',
        descripcion_sancion: descripcionGeneral.trim(),
        dias_suspension: suspensionIndefinida ? null : parseInt(diasSuspension)
      }]
    }

    if (tipoInfraccion === 'falta_entrega') {
      return [{
        id_prestamo: prestamo.id_prestamo,
        id_ejemplar: null,
        id_usuario,
        tipo_infraccion: 'falta_entrega',
        descripcion_sancion: '' // se autogenera en el backend
      }]
    }

    // devolucion_tardia, deterioro, perdida — una sanción por ejemplar
    return ejemplaresSeleccionados.map(id_ejemplar => ({
      id_prestamo: prestamo.id_prestamo,
      id_ejemplar,
      id_usuario,
      tipo_infraccion: tipoInfraccion,
      descripcion_sancion: DESCRIPCION_POR_EJEMPLAR(tipoInfraccion)
        ? descripcionesPorEjemplar[id_ejemplar].trim()
        : descripcionGeneral.trim()
    }))
  }

  const handleSubmitClick = (e) => {
    e.preventDefault()
    const mensaje = validar()
    if (mensaje) { setError(mensaje); return }
    setError(null)
    setMostrarConfirmacion(true)
  }

  const confirmarRegistro = async () => {
    try {
      setLoading(true)
      setError(null)
      const payloads = construirPayloads()
      for (const payload of payloads) {
        await createSanction(payload)
      }
      setMostrarConfirmacion(false)
      setMostrarExito(true)
    } catch (err) {
      setMostrarConfirmacion(false)
      setError(err.response?.data?.error || 'Error al registrar la sanción')
    } finally {
      setLoading(false)
    }
  }

  const limpiarFormulario = () => {
    setTipoInfraccion('')
    setPrestamo(null)
    setUsuarioSeleccionado(null)
    setEjemplaresSeleccionados([])
    setDescripcionGeneral('')
    setDescripcionesPorEjemplar({})
    setDiasSuspension('')
    setSuspensionIndefinida(false)
    setError(null)
  }

  const irYDespues = (ruta) => {
    setMostrarExito(false)
    navigate(ruta, { replace: true })
  }

  const tipoSeleccionadoInfo = TIPOS.find(t => t.value === tipoInfraccion)
  const usuarioMostrado = prestamo
    ? { nombre: prestamo.nombre_apellido, correo: prestamo.correo, ci: prestamo.ci }
    : usuarioSeleccionado
      ? { nombre: usuarioSeleccionado.nombre_apellido, correo: usuarioSeleccionado.correo, ci: usuarioSeleccionado.ci }
      : null

  return (
    <div className="nueva-sancion-page">
      <div className="nueva-sancion-header">
        <button className="sancion-btn sancion-btn--ghost" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h1 className="nueva-sancion-title">Registrar sanción</h1>
      </div>

      <form className="nueva-sancion-form" onSubmit={handleSubmitClick}>

        {/* Tipo de infracción */}
        <div className="nueva-sancion-field">
          <label>Tipo de infracción *</label>
          <div className="nueva-sancion-tipos">
            {TIPOS.map(tipo => (
              <button
                key={tipo.value}
                type="button"
                className={`nueva-sancion-tipo-btn ${tipoInfraccion === tipo.value ? 'activo' : ''}`}
                onClick={() => setTipoInfraccion(tipo.value)}
              >
                <span className="nueva-sancion-tipo-label">{tipo.label}</span>
                <span className="nueva-sancion-tipo-desc">{tipo.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {tipoInfraccion && (
          <>
            {/* ── Selección de usuario (solo comportamiento sin préstamo) ── */}
            {tipoInfraccion === 'comportamiento' && !prestamo && (
              <div className="nueva-sancion-field">
                <label>Usuario a sancionar *</label>

                {usuarioSeleccionado ? (
                  <div className="nueva-sancion-card">
                    <div className="nueva-sancion-card__grid">
                      <div className="sancion-card__item">
                        <span className="sancion-card__label">Nombre</span>
                        <span className="sancion-card__value">{usuarioSeleccionado.nombre_apellido}</span>
                      </div>
                      <div className="sancion-card__item">
                        <span className="sancion-card__label">Correo</span>
                        <span className="sancion-card__value">{usuarioSeleccionado.correo}</span>
                      </div>
                      <div className="sancion-card__item">
                        <span className="sancion-card__label">CI</span>
                        <span className="sancion-card__value">{usuarioSeleccionado.ci}</span>
                      </div>
                    </div>
                    <button type="button" className="sancion-btn sancion-btn--ghost" onClick={quitarUsuario}>
                      Cambiar usuario
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="nueva-sancion-buscador">
                      <input
                        type="text"
                        className="nueva-sancion-input"
                        placeholder="Buscar por nombre, correo o CI..."
                        value={busquedaUsuario}
                        onChange={e => setBusquedaUsuario(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); buscarUsuarios() } }}
                      />
                      <button type="button" className="sancion-btn sancion-btn--primario" onClick={buscarUsuarios} disabled={buscandoUsuario}>
                        {buscandoUsuario ? 'Buscando...' : 'Buscar'}
                      </button>
                    </div>

                    {resultadosUsuario.length > 0 && (
                      <div className="nueva-sancion-resultados">
                        {resultadosUsuario.map(u => (
                          <button
                            type="button"
                            key={u.id_usuario}
                            className="nueva-sancion-resultado-item"
                            onClick={() => seleccionarUsuario(u)}
                          >
                            <span className="nueva-sancion-resultado-titulo">{u.nombre_apellido}</span>
                            <span className="nueva-sancion-resultado-detalle">{u.correo} · CI: {u.ci}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ── Selección de préstamo (todos menos comportamiento, o comportamiento si quiere asociarlo) ── */}
            {REQUIERE_PRESTAMO(tipoInfraccion) && (
              <div className="nueva-sancion-field">
                <label>Préstamo a sancionar *</label>

                {loadingPrestamo && <p className="nueva-sancion-hint">Cargando préstamo...</p>}

                {!loadingPrestamo && !prestamo && (
                  <>
                    <div className="nueva-sancion-buscador">
                      <input
                        type="text"
                        className="nueva-sancion-input"
                        placeholder="Buscar por nombre, correo o CI del usuario..."
                        value={busquedaPrestamo}
                        onChange={e => setBusquedaPrestamo(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); buscarPrestamos() } }}
                      />
                      <button type="button" className="sancion-btn sancion-btn--primario" onClick={buscarPrestamos} disabled={buscandoPrestamo}>
                        {buscandoPrestamo ? 'Buscando...' : 'Buscar'}
                      </button>
                    </div>

                    {resultadosPrestamo.length > 0 && (
                      <div className="nueva-sancion-resultados">
                        {resultadosPrestamo.map(p => (
                          <button
                            type="button"
                            key={p.id_prestamo}
                            className="nueva-sancion-resultado-item"
                            onClick={() => seleccionarPrestamo(p)}
                          >
                            <span className="nueva-sancion-resultado-titulo">
                              Préstamo #{p.id_prestamo} — {p.nombre_apellido}
                            </span>
                            <span className="nueva-sancion-resultado-detalle">
                              {p.correo} · CI: {p.ci} · Estado: {p.estado_prestamo} · Tope: {formatFecha(p.fecha_tope_devolucion)}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {!loadingPrestamo && prestamo && (
                  <div className="nueva-sancion-card">
                    <span className="nueva-sancion-card__titulo">Información del préstamo</span>
                    <div className="nueva-sancion-card__grid">
                      <div className="sancion-card__item">
                        <span className="sancion-card__label">Usuario</span>
                        <span className="sancion-card__value">{prestamo.nombre_apellido}</span>
                      </div>
                      <div className="sancion-card__item">
                        <span className="sancion-card__label">Correo</span>
                        <span className="sancion-card__value">{prestamo.correo}</span>
                      </div>
                      <div className="sancion-card__item">
                        <span className="sancion-card__label">Préstamo</span>
                        <span className="sancion-card__value">#{prestamo.id_prestamo}</span>
                      </div>
                      <div className="sancion-card__item">
                        <span className="sancion-card__label">Fecha tope</span>
                        <span className="sancion-card__value">{formatFecha(prestamo.fecha_tope_devolucion)}</span>
                      </div>
                      <div className="sancion-card__item">
                        <span className="sancion-card__label">Estado</span>
                        <span className="sancion-card__value">{prestamo.estado_prestamo}</span>
                      </div>
                    </div>
                    <button type="button" className="sancion-btn sancion-btn--ghost" onClick={quitarPrestamo}>
                      Cambiar préstamo
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Selección de ejemplares (devolucion_tardia, deterioro, perdida) ── */}
            {REQUIERE_EJEMPLAR(tipoInfraccion) && prestamo && (
              <div className="nueva-sancion-field">
                <label>Ejemplares a sancionar *</label>
                {prestamo.ejemplares?.length === 0 && (
                  <p className="nueva-sancion-hint">Este préstamo no tiene ejemplares asociados.</p>
                )}
                <div className="nueva-sancion-ejemplares">
                  {prestamo.ejemplares?.map(det => (
                    <label key={det.id_ejemplar} className="nueva-sancion-ejemplar-check">
                      <input
                        type="checkbox"
                        checked={ejemplaresSeleccionados.includes(det.id_ejemplar)}
                        onChange={() => toggleEjemplar(det.id_ejemplar)}
                      />
                      <span>
                        #{det.id_ejemplar} — {det.titulo} ({det.autor}) · estado: {det.estado_prestamo_ejemplar}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Descripción individual por ejemplar — deterioro y pérdida */}
                {DESCRIPCION_POR_EJEMPLAR(tipoInfraccion) && ejemplaresSeleccionados.length > 0 && (
                  <div className="nueva-sancion-descripciones-ejemplar">
                    {ejemplaresSeleccionados.map(id_ejemplar => {
                      const det = prestamo.ejemplares.find(e => e.id_ejemplar === id_ejemplar)
                      return (
                        <div key={id_ejemplar} className="nueva-sancion-field">
                          <label>
                            Descripción para ejemplar #{id_ejemplar}{det ? ` — ${det.titulo}` : ''} *
                          </label>
                          <textarea
                            value={descripcionesPorEjemplar[id_ejemplar] || ''}
                            onChange={e => setDescripcionesPorEjemplar(prev => ({
                              ...prev,
                              [id_ejemplar]: e.target.value
                            }))}
                            placeholder="Describí el estado o la situación de este ejemplar..."
                            className="nueva-sancion-textarea"
                            rows={3}
                          />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Días de suspensión — solo comportamiento ── */}
            {tipoInfraccion === 'comportamiento' && (
              <div className="nueva-sancion-field">
                <label>Duración de la suspensión *</label>
                <div className="nueva-sancion-suspension">
                  <label className="nueva-sancion-ejemplar-check">
                    <input
                      type="checkbox"
                      checked={suspensionIndefinida}
                      onChange={e => {
                        setSuspensionIndefinida(e.target.checked)
                        if (e.target.checked) setDiasSuspension('')
                      }}
                    />
                    <span>Indefinida (se resuelve manualmente más adelante)</span>
                  </label>

                  {!suspensionIndefinida && (
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={diasSuspension}
                      onChange={e => setDiasSuspension(e.target.value)}
                      placeholder="Cantidad de días, ej: 30"
                      className="nueva-sancion-input"
                    />
                  )}
                </div>
              </div>
            )}

            {/* ── Descripción general (no aplica a falta_entrega ni a deterioro/perdida) ── */}
            {DESCRIPCION_OBLIGATORIA(tipoInfraccion) && !DESCRIPCION_POR_EJEMPLAR(tipoInfraccion) && (
              <div className="nueva-sancion-field">
                <label>Descripción de la sanción *</label>
                {tipoInfraccion === 'devolucion_tardia' && ejemplaresSeleccionados.length > 1 && (
                  <p className="nueva-sancion-hint">
                    Esta descripción se aplicará a los {ejemplaresSeleccionados.length} ejemplares seleccionados.
                  </p>
                )}
                {tipoInfraccion === 'comportamiento' && (
                  <p className="nueva-sancion-hint">
                    Especificá el motivo y la duración de la suspensión.
                  </p>
                )}
                <textarea
                  value={descripcionGeneral}
                  onChange={e => setDescripcionGeneral(e.target.value)}
                  placeholder="Describí detalladamente la infracción..."
                  className="nueva-sancion-textarea"
                  rows={4}
                />
              </div>
            )}

            {/* ── Aviso para falta_entrega: descripción automática ── */}
            {tipoInfraccion === 'falta_entrega' && prestamo && (
              <p className="nueva-sancion-hint">
                La descripción de la sanción se generará automáticamente a partir de la fecha tope del préstamo
                ({formatFecha(prestamo.fecha_tope_devolucion)}) y la fecha actual. El usuario tendrá 30 días para
                regularizar su situación antes de que el caso sea escalado.
              </p>
            )}
          </>
        )}

        {error && (
          <p className="nueva-sancion-error">{error}</p>
        )}

        <div className="nueva-sancion-acciones">
          <button type="button" className="sancion-btn sancion-btn--ghost" onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button type="submit" className="sancion-btn sancion-btn--primario" disabled={loading || !tipoInfraccion}>
            {loading ? 'Registrando...' : 'Registrar sanción'}
          </button>
        </div>
      </form>

      {/* ── Modal de confirmación ── */}
      {mostrarConfirmacion && (
        <div className="modal-sancion-overlay" onClick={() => setMostrarConfirmacion(false)}>
          <div className="modal-sancion-box" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-sancion__header">
              <div>
                <h2 className="modal-sancion__title">Confirmar registro</h2>
                <p className="modal-sancion__subtitle">{tipoSeleccionadoInfo?.label}</p>
              </div>
              <button className="modal-dev__cerrar" onClick={() => setMostrarConfirmacion(false)}>✕</button>
            </div>
            <div className="modal-sancion__body">
              {usuarioMostrado && (
                <div className="modal-sancion__seccion">
                  <span className="modal-sancion__seccion-titulo">Usuario a sancionar</span>
                  <div className="modal-sancion__grid">
                    <div className="sancion-card__item">
                      <span className="sancion-card__label">Nombre</span>
                      <span className="sancion-card__value">{usuarioMostrado.nombre}</span>
                    </div>
                    <div className="sancion-card__item">
                      <span className="sancion-card__label">Correo</span>
                      <span className="sancion-card__value">{usuarioMostrado.correo}</span>
                    </div>
                  </div>
                </div>
              )}

              {prestamo && (
                <div className="modal-sancion__seccion">
                  <span className="modal-sancion__seccion-titulo">Préstamo</span>
                  <div className="modal-sancion__grid">
                    <div className="sancion-card__item">
                      <span className="sancion-card__label">ID préstamo</span>
                      <span className="sancion-card__value">#{prestamo.id_prestamo}</span>
                    </div>
                    {REQUIERE_EJEMPLAR(tipoInfraccion) && (
                      <div className="sancion-card__item">
                        <span className="sancion-card__label">Ejemplares</span>
                        <span className="sancion-card__value">{ejemplaresSeleccionados.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {tipoInfraccion === 'comportamiento' && (
                <div className="modal-sancion__seccion">
                  <span className="modal-sancion__seccion-titulo">Suspensión</span>
                  <div className="modal-sancion__grid">
                    <div className="sancion-card__item" style={{ gridColumn: '1 / -1' }}>
                      <span className="sancion-card__label">Duración</span>
                      <span className="sancion-card__value">
                        {suspensionIndefinida ? 'Indefinida (resolución manual)' : `${diasSuspension} día(s)`}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <p className="nueva-sancion-hint">
                Esta acción bloqueará el acceso del usuario a los servicios de la biblioteca hasta que la
                sanción sea resuelta. ¿Deseás continuar?
              </p>
            </div>
            <div className="modal-dev__footer">
              <button className="modal-dev__btn-cancelar" onClick={() => setMostrarConfirmacion(false)} disabled={loading}>
                Cancelar
              </button>
              <button className="sancion-btn sancion-btn--primario" onClick={confirmarRegistro} disabled={loading}>
                {loading ? 'Registrando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal de éxito ── */}
      {mostrarExito && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-icon">✓</div>
            <h2>Sanción registrada con éxito</h2>
            <p>¿Qué querés hacer ahora?</p>
            <div className="nueva-sancion-exito-acciones">
              <button className="success-btn" onClick={() => irYDespues('/admin/sanciones')}>
                Ir a sanciones
              </button>
              <button className="success-btn success-btn--secundario" onClick={() => irYDespues('/admin/devoluciones')}>
                Ir a devoluciones
              </button>
              <button
                className="success-btn success-btn--secundario"
                onClick={() => { setMostrarExito(false); limpiarFormulario() }}
              >
                Quedarme aquí
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NuevaSancionPage