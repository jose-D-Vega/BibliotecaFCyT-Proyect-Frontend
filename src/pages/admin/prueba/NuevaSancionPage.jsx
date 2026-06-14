import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getLoanById } from '../../../services/loans.services'
import { createSanction } from '../../../services/sanctions.services'
import './NuevaSancionPage.css'

const TIPOS = [
  { value: 'devolucion_tardia', label: 'Devolución tardía', desc: 'El usuario no devolvió el material en el tiempo establecido' },
  { value: 'deterioro', label: 'Deterioro de material', desc: 'El material fue devuelto en mal estado' },
  { value: 'perdida', label: 'Pérdida de material', desc: 'El usuario extravió el material prestado' },
  { value: 'comportamiento', label: 'Comportamiento inadecuado', desc: 'El usuario incumplió las normas de la biblioteca' },
]

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const partes = fecha.split('T')[0].split('-')
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

const NuevaSancionPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const id_prestamo = searchParams.get('id_prestamo')
  const ejemplares_ids = searchParams.get('id_ejemplares') // "1,2,3"
  const tipo_sugerido = searchParams.get('tipo') // 'devolucion_tardia', 'deterioro', etc.


  const [prestamo, setPrestamo] = useState(null)
  const [loadingPrestamo, setLoadingPrestamo] = useState(true)
  // En el estado del form
  const [form, setForm] = useState({
    tipo_infraccion: tipo_sugerido || '',
    descripcion_sancion: '',
    ejemplares_seleccionados: ejemplares_ids
      ? ejemplares_ids.split(',').map(Number)
      : [],
    dias_suspension: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id_prestamo) {
      setLoadingPrestamo(false)
      return
    }
    const fetchPrestamo = async () => {
      try {
        const data = await getLoanById(id_prestamo)
        setPrestamo(data)
        // Si no se pasó id_ejemplar, tomar el primero
        if (!ejemplares_ids && data?.detalles?.length > 0) {
          setForm(prev => ({ ...prev, ejemplares_seleccionados: data.detalles[0].id_ejemplar }))
        }
      } catch {
        setError('No se pudo cargar el préstamo')
      } finally {
        setLoadingPrestamo(false)
      }
    }
    fetchPrestamo()
  }, [id_prestamo])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.tipo_infraccion) { setError('Seleccioná el tipo de infracción'); return }
    if (!form.descripcion_sancion.trim()) { setError('Ingresá una descripción'); return }
    if (form.tipo_infraccion !== 'comportamiento' && form.ejemplares_seleccionados.length === 0) {
      setError('Seleccioná al menos un ejemplar'); return
    }
    if (form.tipo_infraccion === 'comportamiento' && !form.dias_suspension) {
      setError('Ingresá los días de suspensión'); return
    }

    try {
      setLoading(true)
      setError(null)

      if (form.tipo_infraccion === 'comportamiento') {
        // Una sola sanción sin ejemplar específico
        await createSanction({
          id_prestamo: id_prestamo ? parseInt(id_prestamo) : null,
          id_ejemplar: form.ejemplares_seleccionados[0] || null,
          id_usuario: prestamo?.id_usuario || id_usuario_comportamiento,
          tipo_infraccion: form.tipo_infraccion,
          descripcion_sancion: form.descripcion_sancion,
          dias_suspension: parseInt(form.dias_suspension)
        })
      } else {
        // Una sanción por cada ejemplar seleccionado
        for (const id_ejemplar of form.ejemplares_seleccionados) {
          await createSanction({
            id_prestamo: parseInt(id_prestamo),
            id_ejemplar,
            id_usuario: prestamo.id_usuario,
            tipo_infraccion: form.tipo_infraccion,
            descripcion_sancion: form.descripcion_sancion,
          })
        }
      }

      navigate('/admin/sanciones', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar la sanción')
    } finally {
      setLoading(false)
    }
  }

  const tipoSeleccionado = TIPOS.find(t => t.value === form.tipo_infraccion)

  return (
    <div className="nueva-sancion-page">
      <div className="nueva-sancion-header">
        <button className="sancion-btn sancion-btn--ghost" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h1 className="nueva-sancion-title">Registrar sanción</h1>
      </div>

      {loadingPrestamo && <p style={{ color: 'rgba(255,255,255,0.4)' }}>Cargando préstamo...</p>}

      {!loadingPrestamo && prestamo && (
        <div className="nueva-sancion-content">

          {/* Info del préstamo */}
          <div className="nueva-sancion-card">
            <span className="nueva-sancion-card__titulo">Información del préstamo</span>
            <div className="nueva-sancion-card__grid">
              <div className="sancion-card__item">
                <span className="sancion-card__label">Usuario</span>
                <span className="sancion-card__value">{prestamo.nombre_apellido}</span>
              </div>
              <div className="sancion-card__item">
                <span className="sancion-card__label">Correo</span>
                <span className="sancion-card__value">{prestamo.correo}</span>
              </div>
              <div className="sancion-card__item">
                <span className="sancion-card__label">Préstamo</span>
                <span className="sancion-card__value">#{prestamo.id_prestamo}</span>
              </div>
              <div className="sancion-card__item">
                <span className="sancion-card__label">Fecha tope</span>
                <span className="sancion-card__value">{formatFecha(prestamo.fecha_tope_devolucion)}</span>
              </div>
              <div className="sancion-card__item">
                <span className="sancion-card__label">Estado</span>
                <span className="sancion-card__value">{prestamo.estado_prestamo}</span>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <form className="nueva-sancion-form" onSubmit={handleSubmit}>

            {/* Ejemplar */}
            {prestamo && form.tipo_infraccion !== 'comportamiento' && (
              <div className="nueva-sancion-field">
                <label>Ejemplares a sancionar *</label>
                <div className="nueva-sancion-ejemplares">
                  {prestamo.detalles?.map(det => (
                    <label key={det.id_ejemplar} className="nueva-sancion-ejemplar-check">
                      <input
                        type="checkbox"
                        checked={form.ejemplares_seleccionados.includes(det.id_ejemplar)}
                        onChange={e => {
                          setForm(prev => ({
                            ...prev,
                            ejemplares_seleccionados: e.target.checked
                              ? [...prev.ejemplares_seleccionados, det.id_ejemplar]
                              : prev.ejemplares_seleccionados.filter(id => id !== det.id_ejemplar)
                          }))
                        }}
                      />
                      <span>#{det.id_ejemplar} — {det.titulo}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Tipo de infracción */}
            <div className="nueva-sancion-field">
              <label>Tipo de infracción *</label>
              <div className="nueva-sancion-tipos">
                {TIPOS.map(tipo => (
                  <button
                    key={tipo.value}
                    type="button"
                    className={`nueva-sancion-tipo-btn ${form.tipo_infraccion === tipo.value ? 'activo' : ''}`}
                    onClick={() => setForm(prev => ({ ...prev, tipo_infraccion: tipo.value, dias_suspension: '' }))}
                  >
                    <span className="nueva-sancion-tipo-label">{tipo.label}</span>
                    <span className="nueva-sancion-tipo-desc">{tipo.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Días de suspensión — solo para comportamiento */}
            {form.tipo_infraccion === 'comportamiento' && (
              <div className="nueva-sancion-field">
                <label>Días de suspensión *</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={form.dias_suspension}
                  onChange={e => setForm(prev => ({ ...prev, dias_suspension: e.target.value }))}
                  placeholder="Ej: 30"
                  className="nueva-sancion-input"
                />
              </div>
            )}

            {/* Descripción */}
            <div className="nueva-sancion-field">
              <label>Descripción detallada *</label>
              {tipoSeleccionado && (
                <p className="nueva-sancion-hint">
                  {form.tipo_infraccion === 'devolucion_tardia' || form.tipo_infraccion === 'deterioro' || form.tipo_infraccion === 'perdida'
                    ? 'El usuario tendrá 30 días para regularizar su situación antes de que el caso sea escalado.'
                    : 'Especificá el motivo y duración de la suspensión.'}
                </p>
              )}
              <textarea
                value={form.descripcion_sancion}
                onChange={e => setForm(prev => ({ ...prev, descripcion_sancion: e.target.value }))}
                placeholder="Describí detalladamente la infracción..."
                className="nueva-sancion-textarea"
                rows={4}
              />
            </div>

            {error && (
              <p className="nueva-sancion-error">{error}</p>
            )}

            <div className="nueva-sancion-acciones">
              <button type="button" className="sancion-btn sancion-btn--ghost" onClick={() => navigate(-1)}>
                Cancelar
              </button>
              <button type="submit" className="sancion-btn sancion-btn--primario" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrar sanción'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default NuevaSancionPage