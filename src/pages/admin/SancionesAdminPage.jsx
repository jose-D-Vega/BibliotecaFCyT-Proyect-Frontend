import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  getSanctions, resolveSanction, escalateSanction,
  confirmSanction, rejectSanction, getSanctionsGrouped,
  getSancionesComportamientoAgrupadas
} from '../../services/sanctions.services'
import SancionPendienteCard from '../../components/sanciones/SancionPendienteCard'
import ModalDetalleSancion from '../../components/sanciones/ModalDetalleSancion'
import SancionGrupoCard from '../../components/sanciones/SancionGrupoCard'
import ModalSancionesLoan from '../../components/sanciones/ModalSancionesLoan'
import SancionComportamientoCard from '../../components/sanciones/SancionComportamientoCard'
import ModalSancionesComportamiento from '../../components/sanciones/ModalSancionesComportamiento'
import ModalConfirmacionAccion from '../../components/sanciones/ModalConfirmacionAccion'
import './styles/SancionesAdminPage.css'


// Las tabs principales de la página
const TABS = [
  { id: 'pendiente_confirmacion', label: 'Pendientes de confirmación' },
  { id: 'activa',                 label: 'Activas' },
  { id: 'escalada',               label: 'Escaladas' },
  { id: 'resuelta,rechazada',     label: 'Historial' },
]

// Sub-tabs dentro de "Activas" y "Escaladas"
const SUB_TABS = [
  { id: 'prestamos',       label: 'Por préstamo' },
  { id: 'comportamiento',  label: 'Por comportamiento' },
]

// Tabs que tienen sub-división préstamos / comportamiento
const TABS_CON_SUBTABS = ['activa', 'resuelta,rechazada']

const SancionesAdminPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [tabActiva, setTabActiva] = useState(
    location.state?.tabActiva || 'pendiente_confirmacion'
  )
  const [subTabActiva, setSubTabActiva] = useState('prestamos')

  const [sanciones,     setSanciones]     = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [pagina,        setPagina]        = useState(1)
  const [totalPaginas,  setTotalPaginas]  = useState(1)
  const [loadingAccion, setLoadingAccion] = useState(false)
  const [mensajeAccion, setMensajeAccion] = useState(null)

  // Modales
  const [sancionDetalle,  setSancionDetalle]  = useState(null)
  const [grupoDetalle,    setGrupoDetalle]    = useState(null)
  const [grupoComportam,  setGrupoComportam]  = useState(null)

  const [modalConfirm, setModalConfirm] = useState(null)// Forma: { titulo, mensaje, detalle, labelConfirmar, variante, onConfirmar }

  const usaSubTabs = TABS_CON_SUBTABS.includes(tabActiva)

  // ── Fetch central ──────────────────────────────────────────────

  const fetchSanciones = useCallback(async (tab, subTab, pag) => {
    try {
      setLoading(true)
      setError(null)

      const esPendiente = tab === 'pendiente_confirmacion'
      const tabTieneSubtabs = TABS_CON_SUBTABS.includes(tab)
      const esComportam = tabTieneSubtabs && subTab === 'comportamiento'

      let data

      if (esPendiente) {
        data = await getSanctions({ estado: tab, page: pag, limit: 12 })
      } else if (esComportam) {
        data = await getSancionesComportamientoAgrupadas({ estado: tab, page: pag, limit: 12 })
      } else {
        data = await getSanctionsGrouped({ estado: tab, page: pag, limit: 12 })
      }

      setSanciones(data.data)
      setTotalPaginas(data.pagination.totalPages)
    } catch {
      setError('Error al cargar las sanciones')
    } finally {
      setLoading(false)
    }
  }, [])

 // UN solo useEffect que escucha todo junto
  useEffect(() => {
    fetchSanciones(tabActiva, subTabActiva, pagina)
  }, [tabActiva, subTabActiva, pagina])

  // ── Helpers ────────────────────────────────────────────────────
  const mostrarMensaje = (tipo, texto) => {
    setMensajeAccion({ tipo, texto })
    setTimeout(() => setMensajeAccion(null), 3000)
  }

  const recargar = () => fetchSanciones(tabActiva, subTabActiva, pagina)

  // ── Acciones sobre sanciones pendientes ───────────────────────
  const handleConfirmar = (sancion) => {
  setModalConfirm({
    titulo: 'Confirmar sanción',
    mensaje: `¿Confirmás la sanción por falta de entrega para ${sancion.usuario_nombre}? El usuario quedará bloqueado hasta que sea resuelta.`,
    detalle: `Sanción #${sancion.id_sancion}`,
    labelConfirmar: 'Confirmar',
    variante: 'primario',
    onConfirmar: async () => {
      try {
        setLoadingAccion(true)
        await confirmSanction(sancion.id_sancion)
        setModalConfirm(null)
        mostrarMensaje('ok', 'Sanción confirmada correctamente')
        recargar()
      } catch (err) {
        mostrarMensaje('error', err.response?.data?.error || 'Error al confirmar')
        setModalConfirm(null)
      } finally {
        setLoadingAccion(false)
      }
    }
  })
}

const handleRechazar = (sancion) => {
  setModalConfirm({
    titulo: 'Rechazar sanción',
    mensaje: `¿Rechazás la sanción de ${sancion.usuario_nombre}? Si no tiene otras sanciones activas, recuperará el acceso al sistema.`,
    detalle: `Sanción #${sancion.id_sancion}`,
    labelConfirmar: 'Rechazar',
    variante: 'escalar',   // gris neutro, sin connotación positiva ni destructiva
    onConfirmar: async () => {
      try {
        setLoadingAccion(true)
        await rejectSanction(sancion.id_sancion)
        setModalConfirm(null)
        mostrarMensaje('ok', 'Sanción rechazada. Usuario desbloqueado.')
        recargar()
      } catch (err) {
        mostrarMensaje('error', err.response?.data?.error || 'Error al rechazar')
        setModalConfirm(null)
      } finally {
        setLoadingAccion(false)
      }
    }
  })
}

const handleResolver = (sancion) => {
  setModalConfirm({
    titulo: 'Resolver sanción',
    mensaje: `¿Marcás como resuelta la sanción #${sancion.id_sancion}? Si el usuario no tiene otras sanciones activas, recuperará el acceso.`,
    detalle: sancion.usuario_nombre,
    labelConfirmar: 'Resolver',
    variante: 'resolver',
    onConfirmar: async () => {
      try {
        setLoadingAccion(true)
        await resolveSanction(sancion.id_sancion)
        setModalConfirm(null)
        mostrarMensaje('ok', 'Sanción resuelta correctamente')
        recargar()
      } catch (err) {
        mostrarMensaje('error', err.response?.data?.error || 'Error al resolver')
        setModalConfirm(null)
      } finally {
        setLoadingAccion(false)
      }
    }
  })
}

const handleEscalar = (sancion) => {
  setModalConfirm({
    titulo: 'Escalar sanción',
    mensaje: `¿Escalás la sanción #${sancion.id_sancion} a entidades superiores? Esta acción indica que el caso requiere intervención de mayor jerarquía.`,
    detalle: sancion.usuario_nombre,
    labelConfirmar: 'Escalar',
    variante: 'escalar',
    onConfirmar: async () => {
      try {
        setLoadingAccion(true)
        await escalateSanction(sancion.id_sancion)
        setModalConfirm(null)
        mostrarMensaje('ok', 'Sanción escalada correctamente')
        recargar()
      } catch (err) {
        mostrarMensaje('error', err.response?.data?.error || 'Error al escalar')
        setModalConfirm(null)
      } finally {
        setLoadingAccion(false)
      }
    }
  })
}

  // ── Computed ───────────────────────────────────────────────────
  const esPendiente = tabActiva === 'pendiente_confirmacion'
  const esComportam = TABS_CON_SUBTABS.includes(tabActiva) && subTabActiva === 'comportamiento'

  const textoVacio = esPendiente
    ? 'No hay sanciones pendientes de confirmación.'
    : esComportam
      ? 'No hay sanciones de comportamiento en esta sección.'
      : 'No hay sanciones en esta sección.'

  return (
    <div className="sanciones-page">
      <div className="sanciones-page__header">
        <h1 className="sanciones-page__title">Sanciones</h1>
        <button
          className="sanciones-nueva-btn"
          onClick={() => navigate('/admin/sanciones/nueva')}
        >
          + Nueva sanción
        </button>
      </div>

      {/* Tabs principales */}
      <div className="sanciones-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`sanciones-tab-btn ${tabActiva === tab.id ? 'activo' : ''}`}
            onClick={() => {
              setSanciones([])
              setPagina(1)
              setSubTabActiva('prestamos')
              setTabActiva(tab.id)
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-tabs — solo en Activas e Historial */}
      {usaSubTabs && (
        <div className="sanciones-subtabs">
          {SUB_TABS.map(sub => (
            <button
              key={sub.id}
              className={`sanciones-subtab-btn ${subTabActiva === sub.id ? 'activo' : ''}`}
              onClick={() => {
                setSanciones([])
                setPagina(1)
                setSubTabActiva(sub.id)
              }}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {mensajeAccion && (
        <p className={`sanciones-mensaje sanciones-mensaje--${mensajeAccion.tipo}`}>
          {mensajeAccion.texto}
        </p>
      )}

      {loading && <p className="sanciones-loading">Cargando...</p>}
      {error   && <p className="sanciones-error">{error}</p>}

      {!loading && !error && sanciones.length === 0 && (
        <p className="sanciones-vacio">{textoVacio}</p>
      )}

      {!loading && sanciones.length > 0 && (
        <>
          {esPendiente && (
            <p className="sanciones-aviso">
              Estos usuarios tienen préstamos vencidos. El sistema los bloqueó preventivamente.
              Confirmá la sanción para mantener el bloqueo o rechazala para restaurar el acceso.
            </p>
          )}

          <div className="sanciones-grid">
            {sanciones.map(s => {
              if (esPendiente) {
                return (
                  <SancionPendienteCard
                    key={s.id_sancion}
                    sancion={s}
                    onConfirmar={handleConfirmar}
                    onRechazar={handleRechazar}
                    onVerDetalle={setSancionDetalle}
                    disabled={loadingAccion}
                  />
                )
              }
              if (esComportam) {
                return (
                  <SancionComportamientoCard
                    key={s.id_usuario}
                    grupo={s}
                    onVerDetalle={s => {
                      if (tabActiva === 'resuelta,rechazada') {
                        navigate(`/admin/sanciones/comportamiento/${s.id_usuario}`, { state: { tabActiva } })
                      } else {
                        setGrupoComportam({ ...s, tabActiva })
                      }
                    }}
                  />
                )
              }
              return (
                <SancionGrupoCard
                  key={s.id_prestamo ?? s.id_sancion}
                  grupo={s}
                  onVerDetalle={s => {
                    if (tabActiva === 'resuelta,rechazada') {
                      navigate(`/admin/sanciones/prestamo/${s.id_prestamo}`, { state: { tabActiva } })
                    } else {
                      setGrupoDetalle({ ...s, tabActiva })
                    }
                  }}
                />
              )
            })}
          </div>

          {totalPaginas > 1 && (
            <div className="sanciones-paginacion">
              {Array.from({ length: totalPaginas }, (_, i) => (
                <button
                  key={i}
                  className={`sanciones-pag-btn ${pagina === i + 1 ? 'activo' : ''}`}
                  onClick={() => setPagina(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal detalle sanción individual (pendientes) */}
      {sancionDetalle && (
        <ModalDetalleSancion
          sancion={sancionDetalle}
          onCerrar={() => setSancionDetalle(null)}
          onConfirmar={handleConfirmar}
          onRechazar={handleRechazar}
        />
      )}

      {/* Modal sanciones de un préstamo */}
      {grupoDetalle && (
        <ModalSancionesLoan
          grupo={grupoDetalle}
          onCerrar={() => setGrupoDetalle(null)}
          onActualizar={recargar}
        />
      )}

      {/* Modal sanciones de comportamiento de un usuario */}
      {grupoComportam && (
        <ModalSancionesComportamiento
          grupo={grupoComportam}
          onCerrar={() => setGrupoComportam(null)}
          onActualizar={recargar}
        />
      )}

      {/* Modal de confirmación de acciones */}
      {modalConfirm && (
        <ModalConfirmacionAccion
          titulo={modalConfirm.titulo}
          mensaje={modalConfirm.mensaje}
          detalle={modalConfirm.detalle}
          labelConfirmar={modalConfirm.labelConfirmar}
          variante={modalConfirm.variante}
          loading={loadingAccion}
          onConfirmar={modalConfirm.onConfirmar}
          onCancelar={() => setModalConfirm(null)}
        />
      )}
    </div>
  )
}

export default SancionesAdminPage