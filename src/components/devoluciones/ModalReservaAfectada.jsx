import { useState } from 'react'
import { resolveReservaAfectada } from '../../services/returns.services'
import './DevolucionesComponents.css'

// reservas: array de { id_prestamo, id_ejemplar_afectado, id_usuario, id_libro, sustituto_disponible, estado_devuelto }
// onResuelto: () => void — se llama cuando se gestionaron todas las reservas afectadas
const ModalReservaAfectada = ({ reservas, onResuelto }) => {
  const [indice, setIndice] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [motivo, setMotivo] = useState('')

  const reserva = reservas[indice]

  const avanzar = () => {
    if (indice + 1 < reservas.length) {
      setIndice(indice + 1)
      setError(null)
    } else {
      onResuelto()
    }
  }

  const handleAccion = async (accion) => {
    try {
      setLoading(true)
      setError(null)
      const payload = accion === 'reasignar'
        ? { accion, id_ejemplar_nuevo: reserva.sustituto_disponible }
        : { accion, motivo: motivo.trim() || undefined }

      await resolveReservaAfectada(reserva.id_prestamo, reserva.id_ejemplar_afectado, payload)
      setMotivo('')
      avanzar()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al gestionar la reserva afectada')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-dev-overlay overlay-in-modal">
      <div className="modal-dev-box" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div className="modal-dev__header">
          <div>
            <h2 className="modal-dev__title">Reserva afectada</h2>
            <p className="modal-dev__subtitle">
              {reservas.length > 1 ? `${indice + 1} de ${reservas.length} · ` : ''}
              El ejemplar #{reserva.id_ejemplar_afectado} estaba reservado para otro usuario
            </p>
          </div>
        </div>

        <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p className="nueva-sancion-hint">
            El ejemplar #{reserva.id_ejemplar_afectado} se devolvió en estado{' '}
            <strong>{reserva.estado_devuelto === 'danado' ? 'dañado' : reserva.estado_devuelto}</strong>{' '}
            y no puede entregarse al usuario que lo tenía reservado (préstamo #{reserva.id_prestamo}).
          </p>

          {reserva.sustituto_disponible ? (
            <>
              <p className="nueva-sancion-hint">
                Hay un ejemplar sustituto disponible: <strong>#{reserva.sustituto_disponible}</strong> del mismo libro.
                ¿Querés reasignar la reserva a ese ejemplar?
              </p>
              <button
                className="sancion-btn sancion-btn--primario"
                style={{ width: '100%', padding: '0.75rem' }}
                onClick={() => handleAccion('reasignar')}
                disabled={loading}
              >
                {loading ? 'Reasignando...' : `Reasignar a ejemplar #${reserva.sustituto_disponible}`}
              </button>
            </>
          ) : (
            <>
              <p className="nueva-sancion-hint">
                No hay ningún ejemplar disponible del mismo libro para sustituirlo.
                Si descartás, este ítem se rechaza definitivamente de la reserva y se le avisa al usuario.
              </p>
              <textarea
                className="nueva-sancion-textarea"
                placeholder="Motivo (opcional)"
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                rows={2}
              />
            </>
          )}

          {error && <p className="modal-dev__error">{error}</p>}

          <button
            className="modal-dev__btn-cancelar"
            style={{ width: '100%' }}
            onClick={() => handleAccion('descartar')}
            disabled={loading}
          >
            {loading ? 'Descartando...' : 'Descartar — no se le entregará este ejemplar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalReservaAfectada