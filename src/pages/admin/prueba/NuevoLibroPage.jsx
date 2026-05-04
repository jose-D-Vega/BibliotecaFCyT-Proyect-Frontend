import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBook } from '../../../services/books.services'

const NuevoLibroPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({
    titulo: '',
    autor: '',
    cantidad_ejemplar: '',
    tipo_material: '',
    anio_publicacion: '',
    editorial: '',
    carrera: '',
    facultad: '',
    ciudad: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const { titulo, autor, cantidad_ejemplar, tipo_material, anio_publicacion } = form
    if (!titulo || !autor || !cantidad_ejemplar || !tipo_material || !anio_publicacion) {
      setError('Completá los campos obligatorios')
      return
    }

    try {
      setLoading(true)

      // Usar FormData para poder enviar imagen
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      const imageInput = document.querySelector('input[type="file"]')
      if (imageInput?.files[0]) {
        formData.append('imagen', imageInput.files[0])
      }

      await createBook(formData)
      navigate('/admin/catalogo')
    } catch {
      setError('Error al crear el libro. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Nuevo libro</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Imagen */}
        <div>
          <label>Imagen de portada</label><br />
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
          {preview && (
            <img src={preview} alt="preview" style={{ marginTop: 8, height: 120, objectFit: 'cover', borderRadius: 8 }} />
          )}
        </div>

        <div>
          <label>Título *</label><br />
          <input name="titulo" value={form.titulo} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <div>
          <label>Autor *</label><br />
          <input name="autor" value={form.autor} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label>Cantidad de ejemplares *</label><br />
            <input name="cantidad_ejemplar" type="number" min="1" value={form.cantidad_ejemplar} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div>
            <label>Año de publicación *</label><br />
            <input name="anio_publicacion" type="number" value={form.anio_publicacion} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
        </div>

        <div>
          <label>Tipo de material *</label><br />
          <select name="tipo_material" value={form.tipo_material} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }}>
            <option value="">Seleccionar</option>
            <option value="libro">Libro</option>
            <option value="revista">Revista</option>
            <option value="tesis">Tesis</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        <div>
          <label>Editorial</label><br />
          <input name="editorial" value={form.editorial} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <div>
          <label>Carrera</label><br />
          <input name="carrera" value={form.carrera} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label>Facultad</label><br />
            <input name="facultad" value={form.facultad} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div>
            <label>Ciudad</label><br />
            <input name="ciudad" value={form.ciudad} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
        </div>

        {error && <p style={{ color: '#a32d2d', background: '#fcebeb', padding: '0.6rem', borderRadius: 8 }}>{error}</p>}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <button type="button" onClick={() => navigate('/admin/catalogo')}
            style={{ padding: '0.6rem 1.2rem', cursor: 'pointer' }}>
            Cancelar
          </button>
          <button type="submit" disabled={loading}
            style={{ padding: '0.6rem 1.2rem', background: '#0c1a2e', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            {loading ? 'Guardando...' : 'Crear libro'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NuevoLibroPage