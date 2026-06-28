const ModalConfirmacionSancion = ({
  tipoInfo, indiceActual, totalTipos,
  usuarioMostrado, prestamo,
  ejemplaresSeleccionados, requiereEjemplar,
  suspensionIndefinida, diasSuspension,
  siguienteTipoLabel,
  loading,
  onCancelar,
  onConfirmar,
}) => (
  <div className="modal-sancion-overlay" onClick={onCancelar}>
    <div className="modal-sancion-box" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
      <div className="modal-sancion__header">
        <div>
          <h2 className="modal-sancion__title">Confirmar registro</h2>
          <p className="modal-sancion__subtitle">
            {tipoInfo?.label}
            {totalTipos > 1 && ` · ${indiceActual} de ${totalTipos}`}
          </p>
        </div>
        <button className="modal-dev__cerrar" onClick={onCancelar}>✕</button>
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
                <span className="sancion-card__label">ID</span>
                <span className="sancion-card__value">#{prestamo.id_prestamo}</span>
              </div>
              {requiereEjemplar && (
                <div className="sancion-card__item">
                  <span className="sancion-card__label">Ejemplares</span>
                  <span className="sancion-card__value">{ejemplaresSeleccionados.length}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {tipoInfo?.value === 'comportamiento' && (
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

        {siguienteTipoLabel && (
          <p className="ns-hint">
            Después confirmarás la sanción por <strong>{siguienteTipoLabel}</strong>.
          </p>
        )}

        <p className="ns-hint">
          Esta acción bloqueará el acceso del usuario hasta que la sanción sea resuelta. ¿Confirmás?
        </p>
      </div>

      <div className="modal-dev__footer">
        <button className="modal-dev__btn-cancelar" onClick={onCancelar} disabled={loading}>
          Cancelar
        </button>
        <button className="sancion-btn sancion-btn--primario" onClick={onConfirmar} disabled={loading}>
          {loading ? 'Registrando...' : 'Confirmar'}
        </button>
      </div>
    </div>
  </div>
)

export default ModalConfirmacionSancion