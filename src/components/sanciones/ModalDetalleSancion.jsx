import './SancionesComponents.css'

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const partes = fecha.split('T')[0].split('-')
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

const TIPO_LABELS = {
  devolucion_tardia: 'Devolución tardía',
  deterioro: 'Deterioro de material',
  perdida: 'Pérdida de material',
  comportamiento: 'Comportamiento inadecuado'
}

const ModalDetalleSancion = ({ sancion, onCerrar, onResolver, onEscalar }) => {
  return (
    <div className="modal-sancion-overlay" onClick={onCerrar}>
      <div className="modal-sancion-box" onClick={e => e.stopPropagation()}>

        <div className="modal-sancion__header">
          <div>
            <h2 className="modal-sancion__title">Detalle de sanción #{sancion.id_sancion}</h2>
            <p className="modal-sancion__subtitle">{TIPO_LABELS[sancion.tipo_infraccion]}</p>
          </div>
          <button className="modal-dev__cerrar" onClick={onCerrar}>✕</button>
        </div>

        <div className="modal-sancion__body">

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
              {sancion.usuario_telefono && (
                <div className="sancion-card__item">
                  <span className="sancion-card__label">Teléfono</span>
                  <span className="sancion-card__value">{sancion.usuario_telefono}</span>
                </div>
              )}
            </div>
          </div>

          <div className="modal-sancion__seccion">
            <span className="modal-sancion__seccion-titulo">Material</span>
            <div className="modal-sancion__grid">
              <div className="sancion-card__item">
                <span className="sancion-card__label">Título</span>
                <span className="sancion-card__value">{sancion.libro_titulo}</span>
              </div>
              <div className="sancion-card__item">
                <span className="sancion-card__label">Autor</span>
                <span className="sancion-card__value">{sancion.libro_autor}</span>
              </div>
              {sancion.editorial && (
                <div className="sancion-card__item">
                  <span className="sancion-card__label">Editorial</span>
                  <span className="sancion-card__value">{sancion.editorial}</span>
                </div>
              )}
              <div className="sancion-card__item">
                <span className="sancion-card__label">Ejemplar</span>
                <span className="sancion-card__value">#{sancion.id_ejemplar}</span>
              </div>
            </div>
          </div>

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
                <span className="sancion-card__label">Estado préstamo</span>
                <span className="sancion-card__value">{sancion.estado_prestamo}</span>
              </div>
            </div>
          </div>

          <div className="modal-sancion__seccion">
            <span className="modal-sancion__seccion-titulo">Sanción</span>
            <div className="modal-sancion__grid">
              <div className="sancion-card__item">
                <span className="sancion-card__label">Tipo</span>
                <span className="sancion-card__value">{TIPO_LABELS[sancion.tipo_infraccion]}</span>
              </div>
              <div className="sancion-card__item">
                <span className="sancion-card__label">Estado</span>
                <span className="sancion-card__value">{sancion.estado_sancion}</span>
              </div>
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
              {sancion.dias_suspension && (
                <div className="sancion-card__item">
                  <span className="sancion-card__label">Días suspensión</span>
                  <span className="sancion-card__value">{sancion.dias_suspension}</span>
                </div>
              )}
              {sancion.fecha_fin_suspension && (
                <div className="sancion-card__item">
                  <span className="sancion-card__label">Fin suspensión</span>
                  <span className="sancion-card__value">{formatFecha(sancion.fecha_fin_suspension)}</span>
                </div>
              )}
              <div className="sancion-card__item" style={{ gridColumn: '1 / -1' }}>
                <span className="sancion-card__label">Descripción</span>
                <span className="sancion-card__value">{sancion.descripcion_sancion}</span>
              </div>
              <div className="sancion-card__item">
                <span className="sancion-card__label">Registrado por</span>
                <span className="sancion-card__value">{sancion.admin_nombre || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-dev__footer">
          {sancion.estado_sancion === 'activa' && (
            <>
              <button
                className="sancion-btn sancion-btn--escalar"
                onClick={() => { onEscalar(sancion); onCerrar() }}
              >
                Escalar
              </button>
              <button
                className="sancion-btn sancion-btn--resolver"
                onClick={() => { onResolver(sancion); onCerrar() }}
              >
                Resolver
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