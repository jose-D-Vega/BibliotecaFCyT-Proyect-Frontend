import { useState } from "react"
import Catalogo from "./pages/user/Catalogo"
import LibroDetalle from "./pages/user/LibroDetalle"
import Carrito from "./pages/user/Carrito"

function App() {
  const [vistaActual, setVistaActual] = useState("catalogo")
  const [vistaAnterior, setVistaAnterior] = useState("catalogo")
  const [libroSeleccionado, setLibroSeleccionado] = useState(null)
  const [carrito, setCarrito] = useState([])

  const irADetalle = (libro) => {
    setLibroSeleccionado(libro)
    setVistaActual("detalle")
  }

  const volverDesdeDetalle = () => {
    setVistaActual("catalogo")
  }

  const irAlCarritoDesdeCatalogo = () => {
    setVistaAnterior("catalogo")
    setVistaActual("carrito")
  }

  const irAlCarritoDesdeDetalle = () => {
    setVistaAnterior("detalle")
    setVistaActual("carrito")
  }

  const volverDesdeCarrito = () => {
    setVistaActual(vistaAnterior)
  }

  const agregarAlCarrito = (libro) => {
    setCarrito((prev) => {
      const yaExiste = prev.some((item) => item.id === libro.id)
      if (yaExiste) return prev
      return [...prev, libro]
    })
  }

  const removerDelCarrito = (idLibro) => {
    setCarrito((prev) => prev.filter((item) => item.id !== idLibro))
  }

  const vaciarCarrito = () => {
    setCarrito([])
  }

  const verDetalleDesdeCarrito = (libro) => {
    setLibroSeleccionado(libro)
    setVistaAnterior("carrito")
    setVistaActual("detalle")
  }

  if (vistaActual === "carrito") {
    return (
      <Carrito
        carrito={carrito}
        onVolver={volverDesdeCarrito}
        onVerDetalle={verDetalleDesdeCarrito}
        onRemover={removerDelCarrito}
        onVaciarCarrito={vaciarCarrito}
      />
    )
  }

  if (vistaActual === "detalle") {
    return (
      <LibroDetalle
        libro={libroSeleccionado}
        onVolver={volverDesdeDetalle}
        onIrAlCarrito={irAlCarritoDesdeDetalle}
        onAgregarAlCarrito={agregarAlCarrito}
      />
    )
  }

  return (
    <Catalogo
      onVerDetalle={irADetalle}
      onIrAlCarrito={irAlCarritoDesdeCatalogo}
    />
  )
}

export default App