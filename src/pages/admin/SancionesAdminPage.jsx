import { useState, useEffect, useCallback } from 'react'
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
import SancionesAdminListado from '../../components/sanciones/SancionesAdminListado'
import './styles/SancionesAdminPage.css'

const TABS = [
  { id: 'pendiente_confirmacion', label: 'Pendientes de confirmación' },
  { id: 'activa', label: 'Activas' },
  { id: 'escalada', label: 'Escaladas' },
  { id: 'resuelta,rechazada', label: 'Historial' },
]

const SUB_TABS = [
  { id: 'prestamos', label: 'Por préstamo' },
  { id: 'comportamiento', label: 'Por comportamiento' },
]

const TABS_CON_SUBTABS = ['activa', 'resuelta,rechazada']

const LIMITE = 12

const SancionesAdminPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [tabActiva, setTabActiva] = useState(
    location.state?.tabActiva || 'pendiente_confirmacion'
  )
  const [subTabActiva, setSubTabActiva] = useState('prestamos')

  const [sanciones, setSanciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [paginas, setPaginas] = useState({
    pendiente_confirmacion: 1,
    activa_prestamos: 1,
    activa_comportamiento: 1,
    escalada_prestamos: 1,
    escalada_comportamiento: 1,
    historial_prestamos: 1,
    historial_comportamiento: 1
  })

  const [totalesPaginas, setTotalesPaginas] = useState({
    pendiente_confirmacion: 1,
    activa_prestamos: 1,
    activa_comportamiento: 1,
    escalada_prestamos: 1,
    escalada_comportamiento: 1,
    historial_prestamos: 1,
    historial_comportamiento: 1
  })

  const [loadingAccion, setLoadingAccion] = useState(false)
  const [mensajeAccion, setMensajeAccion] = useState(null)

  const [sancionDetalle, setSancionDetalle] = useState(null)
  const [grupoDetalle, setGrupoDetalle] = useState(null)
  const [grupoComportam, setGrupoComportam] = useState(null)
  const [modalConfirm, setModalConfirm] = useState(null)

  const usaSubTabs = TABS_CON_SUBTABS.includes(tabActiva)

  const getClavePaginacion = (tab, subTab) => {
    if (tab === 'pendiente_confirmacion') {
      return 'pendiente_confirmacion'
    }

    if (tab === 'resuelta,rechazada') {
      return subTab === 'comportamiento'
        ? 'historial_comportamiento'
        : 'historial_prestamos'
    }

    return subTab === 'comportamiento'
      ? `${tab}_comportamiento`
      : `${tab}_prestamos`
  }

  const cambiarPagina = (clave, pagina) => {
    setPaginas(prev => ({
      ...prev,
      [clave]: pagina
    }))
  }

  const fetchSanciones = useCallback(async (tab, subTab) => {
    try {
      setLoading(true)
      setError(null)

      const clave = getClavePaginacion(tab, subTab)
      const paginaActual = paginas[clave]

      const esPendiente = tab === 'pendiente_confirmacion'
      const esComportam =
        TABS_CON_SUBTABS.includes(tab) &&
        subTab === 'comportamiento'

      let data

      if (esPendiente) {
        data = await getSanctions({
          estado: tab,
          page: paginaActual,
          limit: LIMITE
        })
      } else if (esComportam) {
        data = await getSancionesComportamientoAgrupadas({
          estado: tab,
          page: paginaActual,
          limit: LIMITE
        })
      } else {
        data = await getSanctionsGrouped({
          estado: tab,
          page: paginaActual,
          limit: LIMITE
        })
      }

      setSanciones(data.data)

      setTotalesPaginas(prev => ({
        ...prev,
        [clave]: data.pagination.totalPages
      }))
    } catch {
      setError('Error al cargar las sanciones')
    } finally {
      setLoading(false)
    }
  }, [paginas])

  useEffect(() => {
    fetchSanciones(tabActiva, subTabActiva)
  }, [tabActiva, subTabActiva, paginas, fetchSanciones])

  const recargar = () => {
    fetchSanciones(tabActiva, subTabActiva)
  }

  const mostrarMensaje = (tipo, texto) => {
    setMensajeAccion({ tipo, texto })
    setTimeout(() => setMensajeAccion(null), 3000)
  }

  const renderPaginacion = (clave) => {
    const paginaActual = paginas[clave]
    const total = totalesPaginas[clave]

    if (total <= 1) return null

    const paginasMostrar = []

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= paginaActual - 1 && i <= paginaActual + 1)
      ) {
        paginasMostrar.push(i)
      } else if (
        paginasMostrar[paginasMostrar.length - 1] !== '...'
      ) {
        paginasMostrar.push('...')
      }
    }

    return (
      <div className="sanciones-paginacion">
        <button
          className="sanciones-pag-btn"
          disabled={paginaActual === 1}
          onClick={() => cambiarPagina(clave, 1)}
        >
          {'<<'}
        </button>

        <button
          className="sanciones-pag-btn"
          disabled={paginaActual === 1}
          onClick={() => cambiarPagina(clave, paginaActual - 1)}
        >
          {'<'}
        </button>

        {paginasMostrar.map((p, i) =>
          p === '...' ? (
            <span key={i} className="sanciones-pag-btn">
              ...
            </span>
          ) : (
            <button
              key={i}
              className={`sanciones-pag-btn ${paginaActual === p ? 'activo' : ''}`}
              onClick={() => cambiarPagina(clave, p)}
            >
              {p}
            </button>
          )
        )}

        <button
          className="sanciones-pag-btn"
          disabled={paginaActual === total}
          onClick={() => cambiarPagina(clave, paginaActual + 1)}
        >
          {'>'}
        </button>

        <button
          className="sanciones-pag-btn"
          disabled={paginaActual === total}
          onClick={() => cambiarPagina(clave, total)}
        >
          {'>>'}
        </button>
      </div>
    )
  }
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
      variante: 'escalar',
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

  const esPendiente = tabActiva === 'pendiente_confirmacion'
  const esComportam =
    TABS_CON_SUBTABS.includes(tabActiva) &&
    subTabActiva === 'comportamiento'

  const claveActual = getClavePaginacion(tabActiva, subTabActiva)

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

      <div className="sanciones-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`sanciones-tab-btn ${tabActiva === tab.id ? 'activo' : ''}`}
            onClick={() => {
              setSanciones([])
              setSubTabActiva('prestamos')
              setTabActiva(tab.id)
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {usaSubTabs && (
        <div className="sanciones-subtabs">
          {SUB_TABS.map(sub => (
            <button
              key={sub.id}
              className={`sanciones-subtab-btn ${subTabActiva === sub.id ? 'activo' : ''}`}
              onClick={() => {
                setSanciones([])
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

      {error && <p className="sanciones-error">{error}</p>}

      <SancionesAdminListado
        sanciones={sanciones}
        loading={loading}
        error={error}
        textoVacio={textoVacio}
        esPendiente={esPendiente}
        esComportam={esComportam}
        tabActiva={tabActiva}
        loadingAccion={loadingAccion}
        navigate={navigate}
        handleConfirmar={handleConfirmar}
        handleRechazar={handleRechazar}
        setSancionDetalle={setSancionDetalle}
        setGrupoDetalle={setGrupoDetalle}
        setGrupoComportam={setGrupoComportam}
        renderPaginacion={renderPaginacion}
        claveActual={claveActual}
      />

      {sancionDetalle && (
        <ModalDetalleSancion
          sancion={sancionDetalle}
          onCerrar={() => setSancionDetalle(null)}
          onConfirmar={handleConfirmar}
          onRechazar={handleRechazar}
        />
      )}

      {grupoDetalle && (
        <ModalSancionesLoan
          grupo={grupoDetalle}
          onCerrar={() => setGrupoDetalle(null)}
          onActualizar={recargar}
        />
      )}

      {grupoComportam && (
        <ModalSancionesComportamiento
          grupo={grupoComportam}
          onCerrar={() => setGrupoComportam(null)}
          onActualizar={recargar}
        />
      )}

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