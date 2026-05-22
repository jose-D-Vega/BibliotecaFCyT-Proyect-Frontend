import { useState } from 'react'
import { cancelLoan, renewLoan } from '../../services/loans.services'

const ESTADO_LABELS = {
  solicitado: 'Solicitado',
  aprobado: 'Aprobado',
  parcialmente_aprobado: 'Parcialmente aprobado',
  rechazado: 'Rechazado',
  cancelado: 'Cancelado',
  activo: 'Activo',
  devuelto: 'Devuelto',
  vencido: 'Vencido',
  solicitud_renovacion: 'Renovación solicitada',
  solicitud_reserva: 'Reserva solicitada',
  reserva_aprobada: 'Reserva aprobada',
  reserva_parcialmente_aprobada: 'Reserva parcial',
}

const ESTADOS_CANCELABLES = [
  'solicitado', 'aprobado', 'parcialmente_aprobado',
  'solicitud_reserva', 'reserva_aprobada', 'reserva_parcialmente_aprobada'
]

const ESTADOS_CON_FECHA_TOPE = ['activo', 'vencido', 'devuelto']
const ESTADOS_CON_RESPUESTA = [
  'aprobado', 'parcialmente_aprobado', 'rechazado',
  'reserva_aprobada', 'reserva_parcialmente_aprobada',
  'activo', 'vencido', 'devuelto'
]

const formatFecha = (fecha) => {
  if (!fecha) return null
  // Tomar solo la parte de fecha del string ISO, sin convertir zona horaria
  const partes = fecha.split('T')[0].split('-')
  // partes = ['2026', '05', '16']
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

function PrestamoCard({ prestamo, onAccion }) {
  const [desplegado, setDesplegado] = useState(false)
  const [modal, setModal] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const esCancelable = ESTADOS_CANCELABLES.includes(prestamo.estado_prestamo)
  const esRenovable = prestamo.estado_prestamo === 'activo'
  const mostrarFechaTope = ESTADOS_CON_FECHA_TOPE.includes(prestamo.estado_prestamo)
  const mostrarFechaRespuesta = ESTADOS_CON_RESPUESTA.includes(prestamo.estado_prestamo)
  const mostrarFechaActivacion = ['activo', 'vencido', 'devuelto'].includes(prestamo.estado_prestamo)
  const estaVencido = prestamo.estado_prestamo === 'vencido'

  const totalEjemplares = prestamo.detalles?.length || 0

  const handleCancelar = async () => {
    setLoading(true)
    setError('')
    try {
      await cancelLoan(prestamo.id_prestamo)
      setModal(null)
      onAccion?.()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cancelar')
    } finally {
      setLoading(false)
    }
  }

  const handleRenovar = async () => {
    setLoading(true)
    setError('')
    try {
      await renewLoan(prestamo.id_prestamo)
      setModal(null)
      onAccion?.()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al renovar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="prestamo-card">

        {/* Header */}
        <div className="prestamo-card__header">
          <div className="prestamo-card__meta">
            <span className="prestamo-card__tipo">
              {prestamo.es_reserva ? 'Reserva' : 'Préstamo'}
            </span>
            <span className="prestamo-card__fecha">
              Solicitado el {formatFecha(prestamo.fecha_solicitud)}
            </span>
            {mostrarFechaRespuesta && prestamo.fecha_respuesta && (
              <span className="prestamo-card__fecha">
                - Respondido el {formatFecha(prestamo.fecha_respuesta)}
              </span>
            )}
            {mostrarFechaActivacion && prestamo.fecha_activacion && (
              <span className="prestamo-card__fecha">
                - Activado el {formatFecha(prestamo.fecha_activacion)}
              </span>
            )}
          </div>
          <span className={`prestamo-card__estado estado-${prestamo.estado_prestamo}`}>
            {ESTADO_LABELS[prestamo.estado_prestamo] || prestamo.estado_prestamo}
          </span>
        </div>

        {/* Ejemplares desplegables */}
        {totalEjemplares > 0 && (
          <div className="prestamo-card__ejemplares-wrapper">
            <button
              className="prestamo-card__toggle"
              onClick={() => setDesplegado(d => !d)}
            >
              <span>
                {totalEjemplares} ejemplar{totalEjemplares !== 1 ? 'es' : ''}
              </span>
              <span className={`prestamo-card__toggle-arrow ${desplegado ? 'open' : ''}`}>
                ▼
              </span>
            </button>

            {desplegado && (
              <div className="prestamo-card__ejemplares">
                {prestamo.detalles.map((det, i) => (
                  <div key={i} className="prestamo-card__ejemplar-item">
                    <div className="prestamo-card__ejemplar-info">
                      <span className="prestamo-card__ejemplar-titulo">{det.titulo}</span>
                      <span className="prestamo-card__ejemplar-autor">{det.autor}</span>
                      {det.observaciones && (
                        <span className="prestamo-card__ejemplar-obs">
                          {det.observaciones}
                        </span>
                      )}
                    </div>
                    <span className={`prestamo-card__libro-estado estado-${det.estado_prestamo_ejemplar}`}>
                      {ESTADO_LABELS[det.estado_prestamo_ejemplar] || det.estado_prestamo_ejemplar}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {(mostrarFechaTope || esCancelable || esRenovable) && (
          <div className="prestamo-card__footer">
            {mostrarFechaTope && prestamo.fecha_tope_devolucion && (
              <span className={`prestamo-card__fecha-tope ${estaVencido ? 'vencido' : ''}`}>
                {prestamo.estado_prestamo === 'devuelto'
                  ? `Devuelto — límite era ${formatFecha(prestamo.fecha_tope_devolucion)}`
                  : estaVencido
                    ? `Venció el ${formatFecha(prestamo.fecha_tope_devolucion)}`
                    : `Devolver antes del ${formatFecha(prestamo.fecha_tope_devolucion)}`
                }
              </span>
            )}
            <div className="prestamo-card__acciones">
              {esCancelable && (
                <button className="prestamo-btn cancelar" onClick={() => setModal('cancelar')}>
                  Cancelar
                </button>
              )}
              {esRenovable && (
                <button className="prestamo-btn renovar" onClick={() => setModal('renovar')}>
                  Renovar
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal cancelar */}
      {modal === 'cancelar' && (
        <div className="prestamo-modal-overlay">
          <div className="prestamo-modal-box">
            <h3>Cancelar solicitud</h3>
            <p>¿Estás seguro de que deseas cancelar este préstamo? Esta acción no se puede deshacer.</p>
            {error && <p style={{ color: '#f87171', fontSize: '0.875rem', margin: '0 0 12px' }}>{error}</p>}
            <div className="prestamo-modal-acciones">
              <button className="modal-btn secundario" onClick={() => { setModal(null); setError('') }} disabled={loading}>
                Volver
              </button>
              <button className="modal-btn primario" onClick={handleCancelar} disabled={loading}>
                {loading ? 'Cancelando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal renovar */}
      {modal === 'renovar' && (
        <div className="prestamo-modal-overlay">
          <div className="prestamo-modal-box">
            <h3>Solicitar renovación</h3>
            <p>Se enviará una solicitud de renovación. El bibliotecario deberá aprobarla antes de que venza el plazo.</p>
            {error && <p style={{ color: '#f87171', fontSize: '0.875rem', margin: '0 0 12px' }}>{error}</p>}
            <div className="prestamo-modal-acciones">
              <button className="modal-btn secundario" onClick={() => { setModal(null); setError('') }} disabled={loading}>
                Cancelar
              </button>
              <button className="modal-btn renovar" onClick={handleRenovar} disabled={loading}>
                {loading ? 'Enviando...' : 'Solicitar renovación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PrestamoCard
