import { useEffect, useState } from 'react'
import { getLoans } from '../../services/loans.services'
import PrestamoCard from './PrestamoCard'

const ESTADOS_ACTIVOS = {
  'En solicitud': [
    'solicitado', 'solicitud_reserva', 'solicitud_renovacion'
  ],
  'Aprobados': [
    'aprobado', 'parcialmente_aprobado',
    'reserva_aprobada', 'reserva_parcialmente_aprobada'
  ],
  'En curso': ['activo'],
  'Vencidos': ['vencido'],
}

// Estados que ya no se muestran acá (van al historial o no aplican)
const ESTADOS_EXCLUIDOS = ['devuelto', 'cancelado', 'rechazado', 'renovado']

function PrestamosActivos() {
  const [prestamos, setPrestamos] = useState([])
  const [loading, setLoading] = useState(true)

  const cargarPrestamos = async () => {
    setLoading(true)
    try {
      const res = await getLoans({ limit: 100 })

      // ids de cadena (id_prestamo_original) que ya tienen una renovación
      // esperando respuesta del bibliotecario
      const cadenasConRenovacionPendiente = new Set(
        res.data
          .filter(p => p.estado_prestamo === 'solicitud_renovacion')
          .map(p => p.id_prestamo_original)
      )

      const activos = res.data
        .filter(p => !ESTADOS_EXCLUIDOS.includes(p.estado_prestamo))
        .map(p => ({
          ...p,
          renovacionPendiente: cadenasConRenovacionPendiente.has(p.id_prestamo_original || p.id_prestamo)
        }))

      setPrestamos(activos)
    } catch (err) {
      console.error('Error al cargar préstamos activos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargarPrestamos() }, [])

  if (loading) return (
  <div className="prestamos-loading">
    <div className="prestamos-spinner"></div>
    <span>Cargando préstamos...</span>
  </div>
)

  if (prestamos.length === 0) {
    return (
      <p className="prestamos-vacio">
        No tenés préstamos activos en este momento.
      </p>
    )
  }

  return (
    <div>
      {Object.entries(ESTADOS_ACTIVOS).map(([seccion, estados]) => {
        const items = prestamos.filter(p => estados.includes(p.estado_prestamo))
        if (items.length === 0) return null

        return (
          <div key={seccion} className="prestamos-seccion">
            <p className="prestamos-seccion-titulo">{seccion}</p>
            <div className="prestamos-lista">
              {items.map(p => (
                <PrestamoCard
                  key={p.id_prestamo}
                  prestamo={p}
                  onAccion={cargarPrestamos}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PrestamosActivos