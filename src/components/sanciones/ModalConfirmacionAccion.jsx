/**
 * Modal de confirmación genérico para acciones sobre sanciones.
 * Reemplaza window.confirm en SancionesAdminPage y ModalSancionesLoan.
 */
const ModalConfirmacionAccion = ({
  titulo,
  mensaje,
  detalle,
  labelConfirmar = 'Confirmar',
  variante = 'primario',   // 'primario' | 'resolver' | 'escalar' | 'desescalar' | 'rechazar'
  loading = false,
  onConfirmar,
  onCancelar,
}) => (
  <div className="modal-sancion-overlay overlay-in-card" onClick={onCancelar}>
    <div
      className="modal-sancion-box"
      style={{ maxWidth: 420 }}
      onClick={e => e.stopPropagation()}
    >
      <div className="modal-sancion__header">
        <div>
          <h2 className="modal-sancion__title">{titulo}</h2>
          {detalle && <p className="modal-sancion__subtitle">{detalle}</p>}
        </div>
        <button className="modal-dev__cerrar" onClick={onCancelar}>✕</button>
      </div>

      <div className="modal-sancion__body">
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6 }}>
          {mensaje}
        </p>
      </div>

      <div className="modal-dev__footer">
        <button
          className="modal-dev__btn-cancelar"
          onClick={onCancelar}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          className={`sancion-btn sancion-btn--${variante}`}
          onClick={onConfirmar}
          disabled={loading}
        >
          {loading ? 'Procesando...' : labelConfirmar}
        </button>
      </div>
    </div>
  </div>
)

export default ModalConfirmacionAccion