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
      const activos = res.data.filter(p =>
        !ESTADOS_EXCLUIDOS.includes(p.estado_prestamo)
      )
      setPrestamos(activos)
    } catch (err) {
      console.error('Error al cargar préstamos activos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargarPrestamos() }, [])

  if (loading) return <p className="prestamos-loading">Cargando préstamos...</p>

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