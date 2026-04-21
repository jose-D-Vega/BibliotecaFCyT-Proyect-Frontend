import { useAuth } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { updateProfile } from '../../../services/users.services'
import './PerfilPage.css'

const PerfilAdminPage = () => {
  const { user, rolActivo, refreshUser, switchRol } = useAuth()
  const navigate = useNavigate()
  const [telefono, setTelefono] = useState(user?.telefono || '')
  const [editando, setEditando] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  const handleGuardar = async () => {
    if (!telefono.trim()) {
      setMensaje({ tipo: 'error', texto: 'El teléfono no puede estar vacío' })
      return
    }
    try {
      setLoading(true)
      await updateProfile({ telefono })
      await refreshUser()
      setEditando(false)
      setMensaje({ tipo: 'ok', texto: 'Teléfono actualizado correctamente' })
      setTimeout(() => setMensaje(null), 3000)
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al guardar. Intentá de nuevo.' })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelar = () => {
    setTelefono(user?.telefono || '')
    setEditando(false)
    setMensaje(null)
  }

  const handleSwitchRol = () => {
    switchRol()
    navigate('/select-rol', { replace: true })
  }

  return (
    <div className="perfil">
      <h1 className="perfil__title">Mi perfil</h1>

      <div className="perfil__card">
        <div className="perfil__avatar perfil__avatar--admin">
          {user?.nombre?.charAt(0).toUpperCase()}
        </div>

        <div className="perfil__info">
          <div className="perfil__field">
            <span className="perfil__label">Nombre completo</span>
            <span className="perfil__value">{user?.nombre}</span>
          </div>

          <div className="perfil__field">
            <span className="perfil__label">Correo institucional</span>
            <span className="perfil__value">{user?.correo}</span>
          </div>

          <div className="perfil__field">
            <span className="perfil__label">Cédula de identidad</span>
            <span className="perfil__value">{user?.ci}</span>
          </div>

          <div className="perfil__field">
            <span className="perfil__label">Teléfono</span>
            {editando ? (
              <div className="perfil__edit">
                <input
                  type="tel"
                  value={telefono}
                  onChange={e => setTelefono(e.target.value)}
                  placeholder="Ej: 0981 123456"
                  disabled={loading}
                  className="perfil__input"
                />
                <div className="perfil__edit-actions">
                  <button className="perfil__btn perfil__btn--primary" onClick={handleGuardar} disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button className="perfil__btn perfil__btn--ghost" onClick={handleCancelar} disabled={loading}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="perfil__value-row">
                <span className="perfil__value">{user?.telefono || '—'}</span>
                <button className="perfil__btn perfil__btn--ghost" onClick={() => setEditando(true)}>
                  Editar
                </button>
              </div>
            )}
          </div>

          <div className="perfil__field">
            <span className="perfil__label">Rol activo</span>
            <div className="perfil__value-row">
              <span className="perfil__badge perfil__badge--admin">
                {rolActivo === 'bibliotecario' ? 'Bibliotecario' : 'Usuario'}
              </span>
              <button className="perfil__btn perfil__btn--ghost" onClick={handleSwitchRol}>
                Cambiar rol
              </button>
            </div>
          </div>
        </div>

        {mensaje && (
          <p className={`perfil__mensaje perfil__mensaje--${mensaje.tipo}`}>
            {mensaje.texto}
          </p>
        )}
      </div>
    </div>
  )
}

export default PerfilAdminPage