
import { useState } from "react"
import Catalogo from "../CatalogoAdmin"
import LibroDetalle from "../LibroDetalleAdmin"

function AdminCatalogoPage() {
  const [vistaActual, setVistaActual] = useState("catalogo")
  const [vistaAnterior, setVistaAnterior] = useState("catalogo")
  const [libroSeleccionado, setLibroSeleccionado] = useState(null)

  const irADetalle = (libro) => {
    setLibroSeleccionado(libro)
    setVistaActual("detalle")
  }

  const volverDesdeDetalle = () => {
    setVistaActual("catalogo")
  }


  if (vistaActual === "detalle") {
    return (
      <LibroDetalle
        libro={libroSeleccionado}
        onVolver={volverDesdeDetalle}
      />
    )
  }

  return (
    <Catalogo
      onVerDetalle={irADetalle}
    />
  )
}

export default AdminCatalogoPage