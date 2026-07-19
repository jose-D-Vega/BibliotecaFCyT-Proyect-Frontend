import { useEffect, useState, useRef } from "react"
import LibroCard from "../LibroCard"
import { getBooks } from "../../services/books.services"
import "./styles/ListaLibros.css"

function ListaLibros({
  pagina,
  busqueda = "",
  modoBusqueda = "titulo",
  setTotalPaginas,
  areas = "",
  tipo = "",
  orden = "",
  onVerDetalle
}) {
  const gridRef = useRef(null)
  const [libros, setLibros] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [librosPorPagina, setLibrosPorPagina] = useState(null)
  const [gridListo, setGridListo] = useState(false)

  useEffect(() => {
    const actualizar = () => {
      if (!gridRef.current) return
      const anchoContenedor = gridRef.current.offsetWidth
      if (anchoContenedor === 0) return

      const ancho = window.innerWidth
      let anchoMinCard, filas

      if (ancho <= 480) { anchoMinCard = 110; filas = 5 }
      else if (ancho <= 768) { anchoMinCard = 130; filas = 4 }
      else { anchoMinCard = 150; filas = 3 }

      const gap = ancho <= 480 ? 10 : ancho <= 768 ? 12 : 16
      const columnas = Math.max(1, Math.floor((anchoContenedor + gap) / (anchoMinCard + gap)))

      setLibrosPorPagina(columnas * filas)
      setGridListo(true)
    }

    const observer = new ResizeObserver(actualizar)
    if (gridRef.current) observer.observe(gridRef.current)
    window.addEventListener("resize", actualizar)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", actualizar)
    }
  }, [])

  useEffect(() => {
    if (!gridListo) return

    const fetchLibros = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = {
          page: pagina,
          limit: librosPorPagina,
          ...(tipo && { tipo_material: tipo }),
          ...(busqueda.trim() && { search: busqueda.trim() }),
          ...(areas.length > 0 && { carrera: areas }),
          ...(orden && { orden }),
        }

        const response = await getBooks(params)

        setLibros(response.data)
        setTotalPaginas?.(response.pagination.totalPages)
      } catch {
        setError("Error al cargar los libros")
      } finally {
        setLoading(false)
      }
    }

    fetchLibros()
  }, [pagina, areas, busqueda, modoBusqueda, tipo, orden, librosPorPagina, gridListo])

  return (
    <div className="grid-libros" ref={gridRef}>

      {/* 🔥 LOADER DENTRO DEL GRID (NO AFECTA PAGINACIÓN) */}
      {loading && (
        <div className="grid-loader">
          <div className="spinner" />
        </div>
      )}

      {!loading && error && (
        <p style={{ color: '#f09595', gridColumn: '1 / -1', textAlign: 'center' }}>
          {error}
        </p>
      )}

      {!loading && !error && libros.length > 0 &&
        libros.map(libro => (
          <LibroCard
            key={libro.id_libro}
            libro={libro}
            onVerDetalle={onVerDetalle}
          />
        ))
      }

      {!loading && !error && libros.length === 0 && (
        <p style={{ color: 'white', gridColumn: '1 / -1', textAlign: 'center' }}>
          No se encontraron libros
        </p>
      )}
    </div>
  )
}

export default ListaLibros