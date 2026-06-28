import { useState, useCallback } from 'react'
import { searchUsers } from '../../services/users.services'

const BuscadorUsuario = ({ usuario, onUsuarioSeleccionado, onQuitarUsuario }) => {
  const [busqueda, setBusqueda]     = useState('')
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando]     = useState(false)
  const [error, setError]           = useState(null)

  const buscar = useCallback(async () => {
    if (!busqueda.trim()) return
    try {
      setBuscando(true)
      setError(null)
      const data = await searchUsers(busqueda.trim())
      setResultados(data)
      if (data.length === 0) setError('No se encontraron usuarios')
    } catch {
      setError('Error al buscar usuarios')
    } finally {
      setBuscando(false)
    }
  }, [busqueda])

  if (usuario) {
    return (
      <div className="ns-card">
        <span className="ns-card__titulo">Usuario seleccionado</span>
        <div className="ns-card__grid">
          <div className="sancion-card__item">
            <span className="sancion-card__label">Nombre</span>
            <span className="sancion-card__value">{usuario.nombre_apellido}</span>
          </div>
          <div className="sancion-card__item">
            <span className="sancion-card__label">Correo</span>
            <span className="sancion-card__value">{usuario.correo}</span>
          </div>
          <div className="sancion-card__item">
            <span className="sancion-card__label">CI</span>
            <span className="sancion-card__value">{usuario.ci}</span>
          </div>
        </div>
        <button type="button" className="sancion-btn sancion-btn--ghost" onClick={onQuitarUsuario}>
          Cambiar usuario
        </button>
      </div>
    )
  }

  return (
    <div className="ns-buscador-wrap">
      <div className="ns-buscador">
        <input
          type="text"
          className="nueva-sancion-input"
          placeholder="Buscar por nombre, correo o CI..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); buscar() } }}
        />
        <button
          type="button"
          className="sancion-btn sancion-btn--primario"
          onClick={buscar}
          disabled={buscando}
        >
          {buscando ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {error && <p className="ns-hint ns-hint--error">{error}</p>}

      {resultados.length > 0 && (
        <div className="ns-resultados">
          {resultados.map(u => (
            <button
              type="button"
              key={u.id_usuario}
              className="ns-resultado-item"
              onClick={() => { onUsuarioSeleccionado(u); setResultados([]) }}
            >
              <span className="ns-resultado-titulo">{u.nombre_apellido}</span>
              <span className="ns-resultado-detalle">{u.correo} · CI: {u.ci}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default BuscadorUsuario