import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { updateProfile } from '../../services/users.services'
import logoFCyT from '../../assets/icons/LogoFCyT.png'
import './CompletarPerfilPage.css'

const CompletarPerfilPage = () => {
  const { user, rolActivo, selectRol, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ ci: '', telefono: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.ci.trim()) {
      setError('La cédula de identidad es obligatoria')
      return
    }
    if (!form.telefono.trim()) {
      setError('El número de teléfono es obligatorio')
      return
    }
    try {
      setLoading(true)
      await updateProfile(form)
      await refreshUser() // refrescar datos del usuario en el contexto
      // Redirigir según rol
       if (user.rol === 'bibliotecario') {
            navigate('/select-rol', { replace: true })
        } else {
            selectRol('normal')
            navigate('/dashboard', { replace: true })
        }
    } catch {
      setError('Ocurrió un error al guardar los datos. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="completar-page">
      <div className="completar-card">
        <div className="completar-card__logo">
          <img src={logoFCyT} alt="FCyT" />
        </div>

        <div className="completar-card__body">
          <h1 className="completar-card__title">Completá tu perfil</h1>
          <p className="completar-card__welcome">Hola, {user?.nombre}</p>
          <p className="completar-card__desc">
            Para continuar necesitamos algunos datos adicionales.
            Estos se usarán para gestionar tus préstamos en la biblioteca.
          </p>

          <form onSubmit={handleSubmit} className="completar-form">
            <div className="completar-form__field">
              <label htmlFor="ci">Cédula de identidad *</label>
              <input
                id="ci"
                name="ci"
                type="text"
                placeholder="Ej: 1234567"
                value={form.ci}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="completar-form__field">
              <label htmlFor="telefono">Teléfono *</label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                placeholder="Ej: 0981 123456"
                value={form.telefono}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {error && <p className="completar-form__error">{error}</p>}

            <button type="submit" className="completar-form__btn" disabled={loading}>
              {loading ? 'Guardando...' : 'Continuar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CompletarPerfilPage