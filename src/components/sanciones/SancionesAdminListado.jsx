import SancionPendienteCard from './SancionPendienteCard'
import SancionGrupoCard from './SancionGrupoCard'
import SancionComportamientoCard from './SancionComportamientoCard'

const SancionesAdminListado = ({
  sanciones,
  loading,
  error,
  textoVacio,
  esPendiente,
  esComportam,
  tabActiva,
  loadingAccion,
  navigate,
  handleConfirmar,
  handleRechazar,
  setSancionDetalle,
  setGrupoDetalle,
  setGrupoComportam,
  renderPaginacion,
  claveActual,
  rutaRol
}) => {

  if (loading) {
    return (
      <div className="sanciones-loading">
        <div className="sanciones-spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

  if (error) {
    return <p className="sanciones-error">{error}</p>
  }

  if (sanciones.length === 0) {
    return (
      <p className="sanciones-vacio">
        {textoVacio}
      </p>
    )
  }

  return (
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

                  if(tabActiva === 'resuelta,rechazada'){
                    navigate(
                      `${rutaRol}/sanciones/comportamiento/${s.id_usuario}`,
                      {
                        state:{tabActiva}
                      }
                    )
                  }else{
                    setGrupoComportam({
                      ...s,
                      tabActiva
                    })
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

                if(tabActiva === 'resuelta,rechazada'){
                  navigate(
                    `${rutaRol}/sanciones/prestamo/${s.id_prestamo}`,
                    {
                      state:{tabActiva}
                    }
                  )
                }else{
                  setGrupoDetalle({
                    ...s,
                    tabActiva
                  })
                }

              }}
            />
          )

        })}
      </div>

      {renderPaginacion(claveActual)}
    </>
  )
}

export default SancionesAdminListado