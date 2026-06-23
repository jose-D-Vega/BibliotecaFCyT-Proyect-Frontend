import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getSanctions, resolveSanction, escalateSanction,
  confirmSanction, rejectSanction, getSanctionsGrouped
} from '../../../services/sanctions.services'
import SancionCard from '../../../components/sanciones/SancionCard'
import SancionPendienteCard from '../../../components/sanciones/SancionPendienteCard'
import ModalDetalleSancion from '../../../components/sanciones/ModalDetalleSancion'
import './AdminSancionesPage.css'

import SancionGrupoCard from '../../../components/sanciones/SancionGrupoCard'
import ModalSancionesLoan from '../../../components/sanciones/ModalSancionesLoan'


const TABS = [
  { id: 'pendiente_confirmacion', label: 'Pendientes de confirmación' },
  { id: 'activa', label: 'Activas' },
  { id: 'escalada', label: 'Escaladas' },
  { id: 'resuelta,rechazada', label: 'Historial' },
]

const AdminSancionesPage = () => {
  const navigate = useNavigate()
  const [tabActiva, setTabActiva] = useState('pendiente_confirmacion')
  const [sanciones, setSanciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [sancionDetalle, setSancionDetalle] = useState(null)
  const [loadingAccion, setLoadingAccion] = useState(false)
  const [mensajeAccion, setMensajeAccion] = useState(null)

  const [grupoDetalle, setGrupoDetalle] = useState(null)

  // Cambiar fetchSanciones para usar getSanctionsGrouped en tabs no pendientes
  const fetchSanciones = useCallback(async (estado, pag) => {
    try {
      setLoading(true)
      setError(null)
      const esPendiente = estado === 'pendiente_confirmacion'
      const fn = esPendiente ? getSanctions : getSanctionsGrouped
      const data = await fn({ estado, page: pag, limit: 12 })
      setSanciones(data.data)
      setTotalPaginas(data.pagination.totalPages)
    } catch {
      setError('Error al cargar las sanciones')
    } finally {
      setLoading(false)
    }
  }, [])


  useEffect(() => {
    setPagina(1)
    fetchSanciones(tabActiva, 1)
  }, [tabActiva])

  useEffect(() => {
    fetchSanciones(tabActiva, pagina)
  }, [pagina])

  const mostrarMensaje = (tipo, texto) => {
    setMensajeAccion({ tipo, texto })
    setTimeout(() => setMensajeAccion(null), 3000)
  }

  const handleConfirmar = async (sancion) => {
    if (!window.confirm(`¿Confirmar la sanción por falta de entrega para ${sancion.usuario_nombre}?`)) return
    try {
      setLoadingAccion(true)
      await confirmSanction(sancion.id_sancion)
      mostrarMensaje('ok', 'Sanción confirmada correctamente')
      fetchSanciones(tabActiva, pagina)
    } catch (err) {
      mostrarMensaje('error', err.response?.data?.error || 'Error al confirmar')
    } finally {
      setLoadingAccion(false)
    }
  }

  const handleRechazar = async (sancion) => {
    if (!window.confirm(`¿Rechazar la sanción? El usuario ${sancion.usuario_nombre} recuperará el acceso a los servicios.`)) return
    try {
      setLoadingAccion(true)
      await rejectSanction(sancion.id_sancion)
      mostrarMensaje('ok', 'Sanción rechazada. Usuario desbloqueado.')
      fetchSanciones(tabActiva, pagina)
    } catch (err) {
      mostrarMensaje('error', err.response?.data?.error || 'Error al rechazar')
    } finally {
      setLoadingAccion(false)
    }
  }

  const handleResolver = async (sancion) => {
    if (!window.confirm(`¿Resolver la sanción #${sancion.id_sancion}?`)) return
    try {
      setLoadingAccion(true)
      await resolveSanction(sancion.id_sancion)
      mostrarMensaje('ok', 'Sanción resuelta correctamente')
      fetchSanciones(tabActiva, pagina)
    } catch (err) {
      mostrarMensaje('error', err.response?.data?.error || 'Error al resolver')
    } finally {
      setLoadingAccion(false)
    }
  }

  const handleEscalar = async (sancion) => {
    if (!window.confirm(`¿Escalar la sanción #${sancion.id_sancion} a entidades superiores?`)) return
    try {
      setLoadingAccion(true)
      await escalateSanction(sancion.id_sancion)
      mostrarMensaje('ok', 'Sanción escalada correctamente')
      fetchSanciones(tabActiva, pagina)
    } catch (err) {
      mostrarMensaje('error', err.response?.data?.error || 'Error al escalar')
    } finally {
      setLoadingAccion(false)
    }
  }

  const esPendiente = tabActiva === 'pendiente_confirmacion'

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
            onClick={() => setTabActiva(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mensajeAccion && (
        <p className={`sanciones-mensaje sanciones-mensaje--${mensajeAccion.tipo}`}>
          {mensajeAccion.texto}
        </p>
      )}

      {loading && <p className="sanciones-loading">Cargando...</p>}
      {error && <p className="sanciones-error">{error}</p>}

      {!loading && !error && sanciones.length === 0 && (
        <p className="sanciones-vacio">
          {esPendiente
            ? 'No hay sanciones pendientes de confirmación.'
            : `No hay sanciones en esta sección.`}
        </p>
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
            {sanciones.map(s => (
              esPendiente
                ? <SancionPendienteCard
                    key={s.id_sancion}
                    sancion={s}
                    onConfirmar={handleConfirmar}
                    onRechazar={handleRechazar}
                    onVerDetalle={setSancionDetalle}
                    disabled={loadingAccion}
                  />
                : <SancionGrupoCard
                    key={s.id_prestamo || s.id_sancion}
                    grupo={s}
                    onVerDetalle={setGrupoDetalle}
                  />
            ))}
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

      {grupoDetalle && (
        <ModalSancionesLoan
          grupo={grupoDetalle}
          onCerrar={() => setGrupoDetalle(null)}
          onActualizar={() => fetchSanciones(tabActiva, pagina)}
        />
      )}
    </div>
  )
}

export default AdminSancionesPage