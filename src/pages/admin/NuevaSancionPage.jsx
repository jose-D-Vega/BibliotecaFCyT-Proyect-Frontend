import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { getLoanForSanction, createSanction } from '../../services/sanctions.services'
import { useAuth } from '../../context/AuthContext'
import BuscadorPrestamo      from '../../components/sanciones/BuscadorPrestamo'
import BuscadorUsuario       from '../../components/sanciones/BuscadorUsuario'
import SelectorEjemplares    from '../../components/sanciones/SelectorEjemplares'
import ProgresoSanciones     from '../../components/sanciones/ProgresoSanciones'
import ModalConfirmacionSancion from '../../components/sanciones/ModalConfirmacionSancion'
import ModalConfirmacionAccion from '../../components/sanciones/ModalConfirmacionAccion'
import './styles/NuevaSancionPage.css'

const TIPOS = [
  { value: 'falta_entrega',     label: 'Falta de entrega',         desc: 'El usuario no devolvió el material y el préstamo está vencido' },
  { value: 'devolucion_tardia', label: 'Devolución tardía',        desc: 'El usuario devolvió el material fuera del plazo establecido' },
  { value: 'deterioro',         label: 'Material dañado',          desc: 'El material fue devuelto en mal estado' },
  { value: 'perdida',           label: 'Material perdido',         desc: 'El usuario extravió el material prestado' },
  { value: 'comportamiento',    label: 'Comportamiento inadecuado', desc: 'El usuario incumplió las normas de la biblioteca' },
]

const REQUIERE_PRESTAMO        = (t) => t !== 'comportamiento'
const REQUIERE_EJEMPLAR        = (t) => ['devolucion_tardia', 'deterioro', 'perdida'].includes(t)
const DESCRIPCION_POR_EJEMPLAR = (t) => ['deterioro', 'perdida'].includes(t)
const DESCRIPCION_OBLIGATORIA  = (t) => t !== 'falta_entrega'

const formatFecha = (f) => {
  if (!f) return '—'
  const [a, m, d] = f.split('T')[0].split('-')
  return `${d}/${m}/${a}`
}

// Leer parámetros de location.state + searchParams y devolver el estado inicial
const leerEntrada = (state, searchParams) => {
  const tipos = state?.tiposPendientes
    || (searchParams.get('tipos') || searchParams.get('tipo') || '')
        .split(',').filter(Boolean)
  return {
    tiposPendientesInicial: tipos,
    tipoActivo:             tipos[0] || '',
    tiposPendientesResto:   tipos.slice(1),
    idPrestamoInicial:      searchParams.get('id_prestamo'),
    idEjemplaresInicial:    searchParams.get('id_ejemplares'),
    idUsuarioInicial:       searchParams.get('id_usuario'),
    idEjemplaresDanio: (state?.idEjemplaresDanio && state.idEjemplaresDanio.length > 0)
      ? state.idEjemplaresDanio
      : null,
  }
}

const NuevaSancionPage = () => {
  const { rolActivo } = useAuth()
  const rutaRol = rolActivo === 'admin'
  ? '/admin'
  : '/bibliotecario'
  const navigate       = useNavigate()
  const location       = useLocation()
  const [searchParams] = useSearchParams()

  // ── Estado derivado de la navegación ──
  // Se recalcula cada vez que cambia location (incluyendo navigate replace)
  const entrada = leerEntrada(location.state, searchParams)

  const [tipoInfraccion,  setTipoInfraccion]  = useState(entrada.tipoActivo)
  const [tiposPendientes, setTiposPendientes]  = useState(entrada.tiposPendientesResto)
  const [tiposPendientesInicial]               = useState(entrada.tiposPendientesInicial)
  const [modalCambioTipo, setModalCambioTipo] = useState(null) // null | string (el tipo al que quiere cambiar)


  // ── Efecto clave: sincronizar cuando navigate(replace) cambia location ──
  // Esto resuelve el bug donde el estado no se reseteaba al navegar al siguiente tipo
  useEffect(() => {
    const e = leerEntrada(location.state, searchParams)
    setTipoInfraccion(e.tipoActivo)
    setTiposPendientes(e.tiposPendientesResto)
    setPrestamo(null)
    setEjemplaresSeleccionados(
      e.idEjemplaresDanio
        ? e.idEjemplaresDanio
        : e.idEjemplaresInicial
          ? e.idEjemplaresInicial.split(',').map(Number)
          : []
    )
    setDescripcionGeneral('')
    setDescripcionesPorEjemplar({})
    setDiasSuspension('')
    setSuspensionIndefinida(false)
    setError(null)

    // Si hay id_prestamo en la nueva URL, cargarlo
    if (e.idPrestamoInicial) {
      setLoadingPrestamo(true)
      getLoanForSanction(e.idPrestamoInicial)
        .then(data => setPrestamo(data))
        .catch(() => setError('No se pudo cargar el préstamo indicado'))
        .finally(() => setLoadingPrestamo(false))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]) // location.key cambia en cada navigate, incluso con replace

  // ── Estado del formulario ──

  const [prestamo,           setPrestamo]           = useState(null)
  const [loadingPrestamo,    setLoadingPrestamo]    = useState(!!entrada.idPrestamoInicial)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const [buscadorKey, setBuscadorKey] = useState(0)

  const [ejemplaresSeleccionados,    setEjemplaresSeleccionados]    = useState(
    entrada.idEjemplaresDanio
      ? entrada.idEjemplaresDanio
      : entrada.idEjemplaresInicial
        ? entrada.idEjemplaresInicial.split(',').map(Number)
        : []
  )
  const [descripcionGeneral,         setDescripcionGeneral]         = useState('')
  const [descripcionesPorEjemplar,   setDescripcionesPorEjemplar]   = useState({})
  const [diasSuspension,             setDiasSuspension]             = useState('')
  const [suspensionIndefinida,       setSuspensionIndefinida]       = useState(false)

  const [error,   setError]   = useState(null)
  const [loading, setLoading] = useState(false)

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [mostrarExito,        setMostrarExito]        = useState(false)

  // Cargar préstamo inicial en el primer render
  useEffect(() => {
    if (!entrada.idPrestamoInicial) return
    setLoadingPrestamo(true)
    getLoanForSanction(entrada.idPrestamoInicial)
      .then(data => setPrestamo(data))
      .catch(() => setError('No se pudo cargar el préstamo indicado'))
      .finally(() => setLoadingPrestamo(false))
  // Solo en el primer mount — el useEffect de location.key cubre los siguientes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Limpiar error al cambiar tipo
  useEffect(() => {
    setError(null)
  }, [tipoInfraccion])

  // ── Helpers ──
  const idUsuarioEfectivo = () => {
    if (tipoInfraccion === 'comportamiento')
      return prestamo?.id_usuario || usuarioSeleccionado?.id_usuario || entrada.idUsuarioInicial || null
    return prestamo?.id_usuario || entrada.idUsuarioInicial || null
  }

  const validar = () => {
    if (!tipoInfraccion) return 'Seleccioná el tipo de infracción'
    if (REQUIERE_PRESTAMO(tipoInfraccion) && !prestamo)
      return 'Seleccioná un préstamo para sancionar'
    if (!idUsuarioEfectivo())
      return tipoInfraccion === 'comportamiento'
        ? 'Seleccioná el usuario a sancionar'
        : 'No se pudo determinar el usuario del préstamo'
    if (REQUIERE_EJEMPLAR(tipoInfraccion) && ejemplaresSeleccionados.length === 0)
      return 'Seleccioná al menos un ejemplar'
    if (DESCRIPCION_OBLIGATORIA(tipoInfraccion)) {
      if (DESCRIPCION_POR_EJEMPLAR(tipoInfraccion)) {
        const faltantes = ejemplaresSeleccionados.filter(id => !descripcionesPorEjemplar[id]?.trim())
        if (faltantes.length > 0) return 'Ingresá una descripción para cada ejemplar seleccionado'
      } else if (!descripcionGeneral.trim()) {
        return 'Ingresá una descripción de la sanción'
      }
    }
    if (tipoInfraccion === 'comportamiento' && !suspensionIndefinida && !diasSuspension)
      return 'Ingresá los días de suspensión o marcá suspensión indefinida'
    return null
  }

  const construirPayloads = () => {
    const id_usuario = idUsuarioEfectivo()
    if (tipoInfraccion === 'comportamiento') return [{
      id_prestamo: prestamo?.id_prestamo || null,
      id_ejemplar: null, id_usuario,
      tipo_infraccion: 'comportamiento',
      descripcion_sancion: descripcionGeneral.trim(),
      dias_suspension: suspensionIndefinida ? null : parseInt(diasSuspension)
    }]
    if (tipoInfraccion === 'falta_entrega') return [{
      id_prestamo: prestamo.id_prestamo,
      id_ejemplar: null, id_usuario,
      tipo_infraccion: 'falta_entrega',
      descripcion_sancion: ''
    }]
    return ejemplaresSeleccionados.map(id_ejemplar => ({
      id_prestamo: prestamo.id_prestamo,
      id_ejemplar, id_usuario,
      tipo_infraccion: tipoInfraccion,
      descripcion_sancion: DESCRIPCION_POR_EJEMPLAR(tipoInfraccion)
        ? descripcionesPorEjemplar[id_ejemplar].trim()
        : descripcionGeneral.trim()
    }))
  }

  const limpiarFormulario = () => {
    setPrestamo(null)
    setUsuarioSeleccionado(null)
    setEjemplaresSeleccionados([])
    setDescripcionGeneral('')
    setDescripcionesPorEjemplar({})
    setDiasSuspension('')
    setSuspensionIndefinida(false)
    setError(null)
    setBuscadorKey(k => k + 1)   // fuerza remount del buscador
  }

  const handleCambiarTipo = (nuevoTipo) => {
    if (nuevoTipo === tipoInfraccion) return

    const hayTrabajo = prestamo !== null
      || usuarioSeleccionado !== null
      || ejemplaresSeleccionados.length > 0
      || descripcionGeneral.trim() !== ''
      || Object.keys(descripcionesPorEjemplar).length > 0
      || diasSuspension !== ''

    if (hayTrabajo) {
      setModalCambioTipo(nuevoTipo)   // abre el modal con el tipo destino
    } else {
      limpiarFormulario()
      setTipoInfraccion(nuevoTipo)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const msg = validar()
    if (msg) { setError(msg); return }
    setError(null)
    setMostrarConfirmacion(true)
  }

  const handleCancelar = () => {
    // Limpiar todo el formulario
    setTipoInfraccion('')
    setPrestamo(null)
    setUsuarioSeleccionado(null)
    setEjemplaresSeleccionados([])
    setDescripcionGeneral('')
    setDescripcionesPorEjemplar({})
    setDiasSuspension('')
    setSuspensionIndefinida(false)
    setError(null)

    // Volver el scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const confirmarRegistro = async () => {
    try {
      setLoading(true)
      setError(null)
      for (const payload of construirPayloads()) {
        await createSanction(payload)
      }
      setMostrarConfirmacion(false)

      if (tiposPendientes.length > 0) {
        const params = new URLSearchParams()
        if (prestamo) params.set('id_prestamo', prestamo.id_prestamo)

        navigate(`${rutaRol}/sanciones/nueva?${params.toString()}`, {
          replace: true,
          state: {
            tiposPendientes:  tiposPendientes,          // resto de tipos
            idEjemplaresDanio: location.state?.idEjemplaresDanio || null
          }
        })
      } else {
        setMostrarExito(true)
      }
    } catch (err) {
      setMostrarConfirmacion(false)
      setError(err.response?.data?.error || 'Error al registrar la sanción')
    } finally {
      setLoading(false)
    }
  }

  const irYDespues = (ruta) => navigate(ruta, { replace: true })

  // ── Computed ──
  const esFlujoMultiple = tiposPendientesInicial.length > 1
  const indiceActual    = tiposPendientesInicial.indexOf(tipoInfraccion) + 1
  const tipoInfo        = TIPOS.find(t => t.value === tipoInfraccion)
  const siguienteTipo   = tiposPendientes[0]
  const siguienteTipoLabel = siguienteTipo
    ? TIPOS.find(t => t.value === siguienteTipo)?.label
    : null

  const usuarioMostrado = prestamo
    ? { nombre: prestamo.nombre_apellido, correo: prestamo.correo }
    : usuarioSeleccionado
      ? { nombre: usuarioSeleccionado.nombre_apellido, correo: usuarioSeleccionado.correo }
      : null

  return (
    <div className="nueva-sancion-page">

      {/* Header */}
      <div className="nueva-sancion-header">
        <button className="sancion-btn sancion-btn--ghost" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h1 className="nueva-sancion-title">Registrar sanción</h1>
      </div>

      {/* Banner de progreso */}
      {esFlujoMultiple && (
        <ProgresoSanciones
          tiposPendientesInicial={tiposPendientesInicial}
          tipoActual={tipoInfraccion}
        />
      )}

      <form className="nueva-sancion-form" onSubmit={handleSubmit}>

        {/* Selector de tipo */}
        <div className="nueva-sancion-field">
          <label>Tipo de infracción *</label>
          {esFlujoMultiple ? (
            <div className="ns-tipo-fijo">
              <span className="nueva-sancion-tipo-label">{tipoInfo?.label}</span>
              <span className="nueva-sancion-tipo-desc">{tipoInfo?.desc}</span>
            </div>
          ) : (
            <div className="nueva-sancion-tipos">
              {TIPOS.map(tipo => (
                <button
                  key={tipo.value}
                  type="button"
                  className={`nueva-sancion-tipo-btn${tipoInfraccion === tipo.value ? ' activo' : ''}`}
                  onClick={() => handleCambiarTipo(tipo.value)}
                >
                  <span className="nueva-sancion-tipo-label">{tipo.label}</span>
                  <span className="nueva-sancion-tipo-desc">{tipo.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {tipoInfraccion && (<>

          {/* Buscador de usuario — solo comportamiento sin préstamo */}
          {tipoInfraccion === 'comportamiento' && !prestamo && (
            <div className="nueva-sancion-field">
              <label>Usuario a sancionar *</label>
              <BuscadorUsuario
                usuario={usuarioSeleccionado}
                onUsuarioSeleccionado={setUsuarioSeleccionado}
                onQuitarUsuario={() => setUsuarioSeleccionado(null)}
              />
            </div>
          )}

          {/* Buscador de préstamo */}
          {REQUIERE_PRESTAMO(tipoInfraccion) && (
            <div className="nueva-sancion-field">
              <label>Préstamo a sancionar *</label>
              {loadingPrestamo
                ? <p className="ns-hint">Cargando préstamo...</p>
                : <BuscadorPrestamo
                    key={buscadorKey}
                    tipoInfraccion={tipoInfraccion}
                    prestamo={prestamo}
                    onPrestamoSeleccionado={setPrestamo}
                    onQuitarPrestamo={() => {
                      setPrestamo(null)
                      setEjemplaresSeleccionados([])
                      setDescripcionesPorEjemplar({})
                      setBuscadorKey(k => k + 1)
                    }}
                    bloqueado={esFlujoMultiple}
                  />
              }
            </div>
          )}

          {/* Selector de ejemplares */}
          {REQUIERE_EJEMPLAR(tipoInfraccion) && prestamo && (
            <div className="nueva-sancion-field">
              <label>Ejemplares a sancionar *</label>
              <SelectorEjemplares
                ejemplares={prestamo.ejemplares}
                seleccionados={ejemplaresSeleccionados}
                onToggle={(id) => setEjemplaresSeleccionados(prev =>
                  prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
                )}
                forzados={esFlujoMultiple ? (location.state?.idEjemplaresDanio || null) : null}
                descripcionesPorEjemplar={descripcionesPorEjemplar}
                onDescripcionChange={(id, val) =>
                  setDescripcionesPorEjemplar(prev => ({ ...prev, [id]: val }))
                }
                requiereDescripcionIndividual={DESCRIPCION_POR_EJEMPLAR(tipoInfraccion)}
              />
            </div>
          )}

          {/* Días de suspensión — comportamiento */}
          {tipoInfraccion === 'comportamiento' && (
            <div className="nueva-sancion-field">
              <label>Duración de la suspensión *</label>
              <div className="ns-suspension">
                <label className="nueva-sancion-ejemplar-check">
                  <input
                    type="checkbox"
                    checked={suspensionIndefinida}
                    onChange={e => {
                      setSuspensionIndefinida(e.target.checked)
                      if (e.target.checked) setDiasSuspension('')
                    }}
                  />
                  <span>Indefinida (se resuelve manualmente)</span>
                </label>
                {!suspensionIndefinida && (
                  <input
                    type="number" min="1" max="365"
                    value={diasSuspension}
                    onChange={e => setDiasSuspension(e.target.value)}
                    placeholder="Cantidad de días, ej: 30"
                    className="nueva-sancion-input"
                    style={{ maxWidth: 200 }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Descripción general — devolucion_tardia y comportamiento */}
          {DESCRIPCION_OBLIGATORIA(tipoInfraccion) && !DESCRIPCION_POR_EJEMPLAR(tipoInfraccion) && (
            <div className="nueva-sancion-field">
              <label>Descripción de la sanción *</label>
              {tipoInfraccion === 'devolucion_tardia' && ejemplaresSeleccionados.length > 1 && (
                <p className="ns-hint">
                  Esta descripción se aplicará a los {ejemplaresSeleccionados.length} ejemplares seleccionados.
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

          {/* Aviso falta_entrega */}
          {tipoInfraccion === 'falta_entrega' && prestamo && (
            <p className="ns-hint">
              La descripción se generará automáticamente desde la fecha tope ({formatFecha(prestamo.fecha_tope_devolucion)}).
              El usuario tendrá 30 días para regularizar su situación.
            </p>
          )}

        </>)}

        {error && <p className="nueva-sancion-error">{error}</p>}

        <div className="nueva-sancion-acciones">
          <button type="button" className="sancion-btn sancion-btn--ghost" onClick={handleCancelar}>
            Cancelar
          </button>
          <button type="submit" className="sancion-btn sancion-btn--primario" disabled={loading || !tipoInfraccion}>
            {loading
              ? 'Registrando...'
              : siguienteTipoLabel
                ? `Registrar y continuar → ${siguienteTipoLabel}`
                : 'Registrar sanción'
            }
          </button>
        </div>
      </form>

      {/* Modal advertencia cambio de tipo */}
      {modalCambioTipo && (
        <ModalConfirmacionAccion
          titulo="¿Cambiar tipo de sanción?"
          mensaje="Tenés información cargada para el tipo actual. Si cambiás de tipo, todos los datos del formulario se perderán."
          detalle={`Tipo seleccionado: ${TIPOS.find(t => t.value === modalCambioTipo)?.label}`}
          labelConfirmar="Sí, cambiar"
          variante="escalar"
          onConfirmar={() => {
            limpiarFormulario()
            setTipoInfraccion(modalCambioTipo)
            setModalCambioTipo(null)
          }}
          onCancelar={() => setModalCambioTipo(null)}
        />
      )}

      {/* Modal de confirmación */}
      {mostrarConfirmacion && (
        <ModalConfirmacionSancion
          tipoInfo={tipoInfo}
          indiceActual={indiceActual}
          totalTipos={tiposPendientesInicial.length}
          usuarioMostrado={usuarioMostrado}
          prestamo={prestamo}
          ejemplaresSeleccionados={ejemplaresSeleccionados}
          requiereEjemplar={REQUIERE_EJEMPLAR(tipoInfraccion)}
          suspensionIndefinida={suspensionIndefinida}
          diasSuspension={diasSuspension}
          siguienteTipoLabel={siguienteTipoLabel}
          loading={loading}
          onCancelar={() => setMostrarConfirmacion(false)}
          onConfirmar={confirmarRegistro}
        />
      )}

      {/* Modal de éxito */}
      {mostrarExito && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-icon">✓</div>
            <h2>{tiposPendientesInicial.length > 1 ? 'Sanciones registradas' : 'Sanción registrada'}</h2>
            <p>¿Qué querés hacer ahora?</p>
            <button 
            className="success-btn" 
            onClick={() => irYDespues(`${rutaRol}/sanciones`)}
          >
            Ir a sanciones
          </button>
            <button 
            className="success-btn" 
            style={{ marginTop: '0.5rem' }} 
            onClick={() => irYDespues(`${rutaRol}/devoluciones`)}
          >
            Ir a devoluciones
          </button>
            <button className="success-btn" style={{ marginTop: '0.5rem', background: 'rgba(255,255,255,0.08)', color: '#fff' }} 
              onClick={() => { 
                setMostrarExito(false)
                limpiarFormulario()
                window.scrollTo({ top: 0, behavior: 'smooth' })}}>
              Quedarme aquí
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NuevaSancionPage