import React, { useState, useRef } from "react"
import { Search, X } from "lucide-react"
import { buscarLibros } from "../../services/reports.services"

// Buscador de libro con autocompletar (título o autor), usado en el filtro
// id_libro del reporte de ejemplares. Mismo patrón que BuscadorUsuarioFiltro:
// controlado por el padre vía `libroSeleccionado` para no perder la selección
// visual si el componente se desmonta/remonta (ej. al volver del resultado).
export default function BuscadorLibroFiltro({ libroSeleccionado, onSeleccionar, onQuitar }) {
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
        const data = await buscarLibros(texto.trim())
        setResultados(data)
      } catch (err) {
        console.error("Error al buscar libros:", err)
      } finally {
        setBuscando(false)
      }
    }, 350)
  }

  const handleSeleccionar = (libro) => {
    setQuery("")
    setMostrarLista(false)
    setResultados([])
    onSeleccionar(libro)
  }

  if (libroSeleccionado) {
    return (
      <div className="usuario-search-seleccionado">
        <span>{libroSeleccionado.titulo} — {libroSeleccionado.autor}</span>
        <button type="button" onClick={onQuitar} title="Quitar filtro de libro">
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
          placeholder="Título o autor..."
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
          {!buscando && resultados.map(l => (
            <div key={l.id_libro} className="usuario-search-item" onClick={() => handleSeleccionar(l)}>
              <span className="usuario-search-nombre">{l.titulo}</span>
              <span className="usuario-search-detalle">{l.autor} · {l.tipo_material}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}