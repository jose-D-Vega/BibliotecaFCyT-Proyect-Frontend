import React, { useState, useRef } from "react"
import { Search, X } from "lucide-react"
import { buscarUsuarios } from "../../services/reports.services"

// Buscador de usuario con autocompletar (nombre, correo o CI).
// IMPORTANTE: recibe `usuarioSeleccionado` como prop (controlado desde el padre) en vez de
// guardarlo en estado interno. Así, si este componente se desmonta y se vuelve a montar
// (por ejemplo al volver del resultado a la config del reporte), el usuario elegido sigue
// visible — antes se perdía visualmente porque el estado interno arrancaba en null de nuevo.
export default function BuscadorUsuarioFiltro({ usuarioSeleccionado, onSeleccionar, onQuitar, soloStaff = false }) {
  const [query, setQuery] = useState("")
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [mostrarLista, setMostrarLista] = useState(false)
  const debounceRef = useRef(null)

  const handleQueryChange = (texto) => {
    setQuery(texto)
    setMostrarLista(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (texto.trim().length < 2) {
      setResultados([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setBuscando(true)
      try {
        const data = await buscarUsuarios(texto.trim(), soloStaff)
        setResultados(data)
      } catch (err) {
        console.error("Error al buscar usuarios:", err)
      } finally {
        setBuscando(false)
      }
    }, 350)
  }

  const handleSeleccionar = (usuario) => {
    setQuery("")
    setMostrarLista(false)
    setResultados([])
    onSeleccionar(usuario)
  }

  if (usuarioSeleccionado) {
    return (
      <div className="usuario-search-seleccionado">
        <span>{usuarioSeleccionado.nombre_apellido} — {usuarioSeleccionado.correo}</span>
        <button type="button" onClick={onQuitar} title="Quitar filtro de usuario">
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <div className="usuario-search-wrapper">
      <div className="usuario-search-input">
        <Search size={14} />
        <input
          type="text"
          placeholder="Nombre, correo o CI..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => setMostrarLista(true)}
        />
      </div>
      {mostrarLista && (query.trim().length >= 2) && (
        <div className="usuario-search-dropdown">
          {buscando && <div className="usuario-search-item usuario-search-vacio">Buscando...</div>}
          {!buscando && resultados.length === 0 && (
            <div className="usuario-search-item usuario-search-vacio">Sin coincidencias</div>
          )}
          {!buscando && resultados.map(u => (
            <div key={u.id_usuario} className="usuario-search-item" onClick={() => handleSeleccionar(u)}>
              <span className="usuario-search-nombre">{u.nombre_apellido}</span>
              <span className="usuario-search-detalle">{u.correo} · CI {u.ci}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}