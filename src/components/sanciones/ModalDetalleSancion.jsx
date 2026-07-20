import { useState, useEffect } from 'react'
import { getLoanForSanction } from '../../services/sanctions.services'
import './SancionesComponents.css'

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const partes = fecha.split('T')[0].split('-')
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

const ESTADO_PRESTAMO_LABELS = {
  activo:                 'Activo',
  vencido:                'Vencido',
  devuelto:               'Devuelto',
  pendiente_devolucion:   'Pendiente de devolución',
  renovado:               'Renovado',
}

const ModalDetalleSancion = ({ sancion, onCerrar, onConfirmar, onRechazar }) => {
  const [prestamo,      setPrestamo]      = useState(null)
  const [loadingPrest,  setLoadingPrest]  = useState(true)
  const [errorPrest,    setErrorPrest]    = useState(null)

  useEffect(() => {
    if (!sancion.id_prestamo) {
      setLoadingPrest(false)
      return
    }
    const fetch = async () => {
      try {
        const data = await getLoanForSanction(sancion.id_prestamo)
        setPrestamo(data)
      } catch {
        setErrorPrest('No se pudo cargar la información del préstamo')
      } finally {
        setLoadingPrest(false)
      }
    }
    fetch()
  }, [sancion.id_prestamo])

  return (
    <div className="modal-sancion-overlay" onClick={onCerrar}>
      <div className="modal-sancion-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>

        <div className="modal-sancion__header">
          <div>
            <h2 className="modal-sancion__title">Sanción pendiente #{sancion.id_sancion}</h2>
            <p className="modal-sancion__subtitle">Falta de entrega — vencimiento por plazo</p>
          </div>
          <button className="modal-dev__cerrar" onClick={onCerrar}>✕</button>
        </div>

        <div className="modal-sancion__body">

          {/* Usuario */}
          <div className="modal-sancion__seccion">
            <span className="modal-sancion__seccion-titulo">Usuario sancionado</span>
            <div className="modal-sancion__grid">
              <div className="sancion-card__item">
                <span className="sancion-card__label">Nombre</span>
                <span className="sancion-card__value">{sancion.usuario_nombre}</span>
              </div>
              <div className="sancion-card__item">
                <span className="sancion-card__label">Correo</span>
                <span className="sancion-card__value">{sancion.usuario_correo}</span>
              </div>
              <div className="sancion-card__item">
                <span className="sancion-card__label">CI</span>
                <span className="sancion-card__value">{sancion.usuario_ci}</span>
              </div>
            </div>
          </div>

          {/* Préstamo */}
          <div className="modal-sancion__seccion">
            <span className="modal-sancion__seccion-titulo">Préstamo</span>
            <div className="modal-sancion__grid">
              <div className="sancion-card__item">
                <span className="sancion-card__label">ID préstamo</span>
                <span className="sancion-card__value">#{sancion.id_prestamo}</span>
              </div>
              <div className="sancion-card__item">
                <span className="sancion-card__label">Fecha tope</span>
                <span className="sancion-card__value">{formatFecha(sancion.fecha_tope_devolucion)}</span>
              </div>
              <div className="sancion-card__item">
                <span className="sancion-card__label">Estado</span>
                <span className="sancion-card__value">
                  {ESTADO_PRESTAMO_LABELS[sancion.estado_prestamo] || sancion.estado_prestamo}
                </span>
              </div>
            </div>
          </div>

          {/* Ejemplares */}
          <div className="modal-sancion__seccion">
            <span className="modal-sancion__seccion-titulo">Ejemplares del préstamo</span>
            {loadingPrest && (
              <div className="sanciones-loading-modal">
                <div className="sanciones-spinner"></div>
                <p>Cargando ejemplares...</p>
              </div>
            )}
            {errorPrest && (
              <p className="sanciones-error">{errorPrest}</p>
            )}
            {!loadingPrest && prestamo?.ejemplares?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {prestamo.ejemplares.map(ej => (
                  <div key={ej.id_ejemplar} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 10,
                    padding: '0.75rem 1rem',
                  }}>
                    <div className="modal-sancion__grid" >
                      <div className="sancion-card__item">
                        <span className="sancion-card__label">Ejemplar</span>
                        <span className="sancion-card__value">#{ej.id_ejemplar}</span>
                      </div>
                      <div className="sancion-card__item">
                        <span className="sancion-card__label">Título</span>
                        <span className="sancion-card__value">{ej.titulo}</span>
                      </div>
                      <div className="sancion-card__item">
                        <span className="sancion-card__label">Autor</span>
                        <span className="sancion-card__value">{ej.autor}</span>
                      </div>
                      <div className="sancion-card__item">
                        <span className="sancion-card__label">Estado</span>
                        <span className="sancion-card__value">{ej.estado_ejemplar}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loadingPrest && !errorPrest && (!prestamo?.ejemplares || prestamo.ejemplares.length === 0) && (
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                No se encontraron ejemplares.
              </p>
            )}
          </div>

          {/* Sanción */}
          <div className="modal-sancion__seccion">
            <span className="modal-sancion__seccion-titulo">Sanción generada</span>
            <div className="modal-sancion__grid">
              <div className="sancion-card__item">
                <span className="sancion-card__label">Fecha sanción</span>
                <span className="sancion-card__value">{formatFecha(sancion.fecha_sancion)}</span>
              </div>
              {sancion.fecha_limite && (
                <div className="sancion-card__item">
                  <span className="sancion-card__label">Fecha límite</span>
                  <span className="sancion-card__value">{formatFecha(sancion.fecha_limite)}</span>
                </div>
              )}
              <div className="sancion-card__item" style={{ gridColumn: '1 / -1' }}>
                <span className="sancion-card__label">Descripción</span>
                <span className="sancion-card__value">{sancion.descripcion_sancion}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="modal-dev__footer">
          {sancion.estado_sancion === 'pendiente_confirmacion' && (
            <>
              <button
                className="sancion-btn sancion-btn--escalar"
                onClick={() => { onRechazar(sancion); onCerrar() }}
              >
                Rechazar
              </button>
              <button
                className="sancion-btn sancion-btn--resolver"
                onClick={() => { onConfirmar(sancion); onCerrar() }}
              >
                Confirmar
              </button>
            </>
          )}
          <button className="modal-dev__btn-cancelar" onClick={onCerrar}>Cerrar</button>
        </div>

      </div>
    </div>
  )
}

export default ModalDetalleSancion