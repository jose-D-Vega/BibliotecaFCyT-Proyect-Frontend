import { useEffect, useState } from 'react'
import { getLoans, getLoanById } from '../../services/loans.services'
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

function PrestamosActivos() {
  const [prestamos, setPrestamos] = useState([])
  const [loading, setLoading] = useState(true)

  const cargarPrestamos = async () => {
    setLoading(true)
    try {
      // Traer todos los préstamos activos sin filtro de estado
      const res = await getLoans({ limit: 100 })
      // Filtrar los que no son historial (devuelto, cancelado, rechazado)
      const activos = res.data.filter(p =>
        !['devuelto', 'cancelado', 'rechazado'].includes(p.estado_prestamo)
      )
      // Para cada préstamo traer sus detalles
      const conDetalles = await Promise.all(
        activos.map(p => getLoanById(p.id_prestamo))
      )
      setPrestamos(conDetalles)
    } catch (err) {
      console.error('Error al cargar préstamos activos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargarPrestamos() }, [])

  if (loading) return <p className="prestamos-loading">Cargando préstamos...</p>

  const hayAlguno = prestamos.length > 0

  if (!hayAlguno) {
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