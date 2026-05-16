import { useEffect, useState } from "react"
import LibroCard from "./LibroCard"
import { getBooks } from "../services/books.services"
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
  const [libros, setLibros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [librosPorPagina, setLibrosPorPagina] = useState(20)

  useEffect(() => {
    const actualizar = () => {
      const ancho = window.innerWidth
      if (ancho <= 480) setLibrosPorPagina(10)
      else if (ancho <= 1024) setLibrosPorPagina(15)
      else setLibrosPorPagina(20)
    }
    actualizar()
    window.addEventListener("resize", actualizar)
    return () => window.removeEventListener("resize", actualizar)
  }, [])

  useEffect(() => {
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

        // Búsqueda por título o autor
        //if (busqueda) params.search = busqueda

        const response = await getBooks(params)
        let librosData = response.data

        setLibros(librosData)
        setTotalPaginas?.(response.pagination.totalPages)
      } catch {
        setError('Error al cargar los libros')
      } finally {
        setLoading(false)
      }
    }

    fetchLibros()
  }, [pagina, areas, busqueda, modoBusqueda, tipo, orden, librosPorPagina])

  if (loading) return <p style={{ color: 'white', textAlign: 'center', gridColumn: 'span 4' }}>Cargando libros...</p>
  if (error) return <p style={{ color: '#f09595', textAlign: 'center', gridColumn: 'span 4' }}>{error}</p>

  return (
    <div className="grid-libros">
      {libros.length > 0 ? (
        libros.map(libro => (
          <LibroCard
            key={libro.id_libro}
            libro={libro}
            onVerDetalle={onVerDetalle}
          />
        ))
      ) : (
        <p style={{ color: 'white', gridColumn: '1 / -1', textAlign: 'center' }}>
          No se encontraron libros
        </p>
      )}
    </div>
  )
}

export default ListaLibros