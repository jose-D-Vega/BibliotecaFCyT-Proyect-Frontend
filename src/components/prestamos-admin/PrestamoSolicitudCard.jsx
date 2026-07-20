import { useState } from "react";

import SolicitudTipoBadge from "./SolicitudTipoBadge";
import PrestamoSolicitudModal from "./PrestamoSolicitudModal";
import { capitalizeWords } from "../../utils/textFormatters";

import "./styles/PrestamoSolicitudCard.css";

function PrestamoSolicitudCard({ solicitud, onAceptar }) {
  const [open, setOpen] = useState(false);

  const totalMateriales = solicitud.materiales.length;
  const textoTipoSolicitud = solicitud.tipoSolicitud || "Préstamo";

  return (
    <>
      <article className="solicitud-card-admin">
        {/* LEFT SIDE */}
        <div className="solicitud-card-admin__main">
          <div className="solicitud-card-admin__user">
            <h2 className="solicitud-card-admin__user-name">
              {capitalizeWords(solicitud.usuario)}
            </h2>

            <span className="solicitud-card-admin__date">
              Solicitud realizada el {solicitud.fecha}
            </span>

            <div className="solicitud-card-admin__meta">
              <strong>
                {totalMateriales}{" "}
                {totalMateriales === 1 ? "material" : "materiales"}
              </strong>

              <p>
                {solicitud.totalEjemplares}{" "}
                {solicitud.totalEjemplares === 1
                  ? "ejemplar solicitado"
                  : "ejemplares solicitados"}
              </p>
            </div>
          </div>

          <div className="solicitud-card-admin__badge-slot">
            <SolicitudTipoBadge tipo={textoTipoSolicitud} />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="solicitud-card-admin__actions">
          <button
            className="solicitud-card-admin__btn solicitud-card-admin__btn--details"
            onClick={() => setOpen(true)}
          >
            Ver detalles →
          </button>
        </div>
      </article>

      <PrestamoSolicitudModal
        open={open}
        onClose={() => setOpen(false)}
        solicitud={solicitud}
        onAceptar={onAceptar}
      />
    </>
  );
}

export default PrestamoSolicitudCard;
