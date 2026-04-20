import { useEffect, useState } from "react"
import LibroCard from "./LibroCard"
import "../components/styles/ListaLibros.css"

import calculo from "../assets/images/Calculo.jpg"
import electrica from "../assets/images/Electrica.jpg"
import informatica from "../assets/images/Informatica.jpg"

function ListaLibros({
  pagina,
  busqueda = "",
  modoBusqueda = "titulo",
  setTotalPaginas,
  areas = [],
  tipo = "",
  orden = "",
  onVerDetalle
}) {
  const [librosPorPagina, setLibrosPorPagina] = useState(20)

  useEffect(() => {
    const actualizarLibrosPorPagina = () => {
      const ancho = window.innerWidth

      if (ancho <= 480) {
        setLibrosPorPagina(10)
      } else if (ancho <= 1024) {
        setLibrosPorPagina(15)
      } else {
        setLibrosPorPagina(20)
      }
    }

    actualizarLibrosPorPagina()
    window.addEventListener("resize", actualizarLibrosPorPagina)

    return () => window.removeEventListener("resize", actualizarLibrosPorPagina)
  }, [])

  const imagenes = [calculo, electrica, informatica]

  const datosPorPagina = [
    {
      titulo: "Cálculo Diferencial e Integral",
      autor: "Nikolái Piskunov",
      area: ["General"],
      tipo: "Libro",
      editorial: "Editorial Mir",
      anio: "1982",
      facultad: "Facultad de Ciencias y Tecnologías UNCA",
      ciudad: "Coronel Oviedo",
      ejemplaresDetalle: [
        { codigo: "Ejemplar #1", estado: "Disponible" },
        { codigo: "Ejemplar #2", estado: "Disponible" },
        { codigo: "Ejemplar #3", estado: "Disponible" },
        { codigo: "Ejemplar #4", estado: "Disponible" },
        { codigo: "Ejemplar #5", estado: "Disponible" },
        { codigo: "Ejemplar #6", estado: "En préstamo" },
        { codigo: "Ejemplar #7", estado: "En préstamo" },
        { codigo: "Ejemplar #8", estado: "En préstamo" }
      ]
    },
    {
      titulo: "Fundamentos Físicos de la Ingeniería",
      autor: "Juan Vicente Miguez, Francisco Mur, Miguel Alonso Castro, José Carpio",
      area: ["Electricidad", "Electrónica"],
      tipo: "Libro",
      editorial: "McGraw-Hill",
      anio: "2008",
      facultad: "Facultad de Ciencias y Tecnologías UNCA",
      ciudad: "Coronel Oviedo",
      ejemplaresDetalle: [
        { codigo: "Ejemplar #1", estado: "Disponible" },
        { codigo: "Ejemplar #2", estado: "Disponible" },
        { codigo: "Ejemplar #3", estado: "Disponible" },
        { codigo: "Ejemplar #4", estado: "En préstamo" },
        { codigo: "Ejemplar #5", estado: "En préstamo" }
      ]
    },
    {
      titulo: "Ingeniería de Computadores 2",
      autor: "Sebastián Dormido Canto, José Sánchez Moreno, Victorino Sanz Prat",
      area: ["Informática"],
      tipo: "Libro",
      editorial: "Ra-Ma",
      anio: "2016",
      facultad: "Facultad de Ciencias y Tecnologías UNCA",
      ciudad: "Coronel Oviedo",
      ejemplaresDetalle: [
        { codigo: "Ejemplar #1", estado: "Disponible" },
        { codigo: "Ejemplar #2", estado: "Disponible" },
        { codigo: "Ejemplar #3", estado: "Disponible" },
        { codigo: "Ejemplar #4", estado: "Disponible" },
        { codigo: "Ejemplar #5", estado: "En préstamo" },
        { codigo: "Ejemplar #6", estado: "En préstamo" },
        { codigo: "Ejemplar #7", estado: "En préstamo" }
      ]
    }
  ]

  let librosBase = Array.from({ length: 60 }, (_, i) => {
    const paginaLibro = Math.floor(i / 20)
    const libroBase = datosPorPagina[paginaLibro]

    return {
      id: i,
      titulo: libroBase.titulo,
      autor: libroBase.autor,
      imagen: imagenes[paginaLibro],
      area: libroBase.area,
      tipo: libroBase.tipo,
      editorial: libroBase.editorial,
      anio: libroBase.anio,
      facultad: libroBase.facultad,
      ciudad: libroBase.ciudad,
      ejemplares: libroBase.ejemplaresDetalle.length,
      ejemplaresDetalle: libroBase.ejemplaresDetalle
    }
  })

  let librosFiltrados = librosBase.filter(libro => {
    if (busqueda) {
      if (
        modoBusqueda === "titulo" &&
        !libro.titulo.toLowerCase().includes(busqueda.toLowerCase())
      ) return false

      if (
        modoBusqueda === "autor" &&
        !libro.autor.toLowerCase().includes(busqueda.toLowerCase())
      ) return false
    }

    if (areas.length > 0) {
      if (areas.includes("General")) {
        if (!libro.area.includes("General")) return false
      } else {
        const tieneTodas = areas.every(a => libro.area.includes(a))
        if (!tieneTodas) return false
      }
    }

    if (tipo && libro.tipo !== tipo) return false

    return true
  })

  switch (orden) {
    case "AZ":
      librosFiltrados.sort((a, b) =>
        a.titulo.localeCompare(b.titulo)
      )
      break

    case "ZA":
      librosFiltrados.sort((a, b) =>
        b.titulo.localeCompare(a.titulo)
      )
      break

    case "EJ_DESC":
      librosFiltrados.sort((a, b) =>
        b.ejemplares - a.ejemplares
      )
      break

    case "EJ_ASC":
      librosFiltrados.sort((a, b) =>
        a.ejemplares - b.ejemplares
      )
      break

    default:
      break
  }

  const totalPaginasCalc = Math.max(
    1,
    Math.ceil(librosFiltrados.length / librosPorPagina)
  )

  setTotalPaginas?.(totalPaginasCalc)

  const inicio = (pagina - 1) * librosPorPagina
  const fin = inicio + librosPorPagina

  const librosPagina = librosFiltrados.slice(inicio, fin)

  return (
    <div className="grid-libros">
      {librosPagina.length > 0 ? (
        librosPagina.map(libro => (
          <LibroCard
            key={libro.id}
            libro={libro}
            onVerDetalle={onVerDetalle}
          />
        ))
      ) : (
        <p
          style={{
            color: "white",
            gridColumn: "span 4",
            textAlign: "center"
          }}
        >
          No se encontraron libros
        </p>
      )}
    </div>
  )
}

export default ListaLibros