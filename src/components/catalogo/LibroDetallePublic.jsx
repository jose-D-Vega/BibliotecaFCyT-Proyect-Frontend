import { useMemo, useState } from "react"
import "./styles/LibroDetalle.css"

import LibroInfoItem from "./LibroInfoItem"
import EjemplarItem from "./EjemplarItem"
import FooterLogin from "../login/FooterLogin"

function LibroDetallePublic({ libro, ejemplares: ejemplaresProp, onVolver }) {

  const data = useMemo(() => {
    return libro || {
      id_libro: 0,
      titulo: "Libro de Ejemplo",
      autor: "Autor Ejemplo",
      editorial: "Editorial Ejemplo",
      anio_publicacion: "2023",
      facultad: "Facultad de Ciencias y Tecnologías UNCA",
      ciudad: "Coronel Oviedo",
      carrera: "Informática",
      cantidad_ejemplar: 0
    }
  }, [libro])

  const ejemplares = ejemplaresProp || []
  const ejemplaresTotal = ejemplares.length
  const disponibles = ejemplares.filter(e => e.estado_ejemplar === "disponible").length
  const enPrestamo = ejemplares.filter(e => e.estado_ejemplar === "prestado").length
  const reservados = ejemplares.filter(e => e.estado_ejemplar === "reservado").length




  return (
    <div className="detalle-page">
      <header className="detalle-header">
        <button className="btn-volver" onClick={onVolver}>← Volver</button>
        <h2 className="header-title">Detalles del libro</h2>
      </header>

      <main className="detalle-container">
        <section className="detalle-card">
          <div className="portada-wrapper">
            <div className="portada">
              {data.imagen_url
                ? <img src={data.imagen_url} alt="portada" />
                : <div className="portada-placeholder">{data.titulo?.charAt(0)}</div>
              }
            </div>

          </div>

          <div className="info">
            <h1 className="titulo-libro">{data.titulo}</h1>
            <div className="resumen-ejemplares">
              <span className="resumen-badge disponible">{disponibles} disponibles</span>
              <span className="resumen-badge prestamo">{enPrestamo} en préstamo</span>
              {reservados > 0 && (
                <span className="resumen-badge reservado">{reservados} reservados</span>
              )}
            </div>
            <div className="info-grid">
              <LibroInfoItem label="Autor" value={data.autor} />
              <LibroInfoItem label="Editorial" value={data.editorial} />
              <LibroInfoItem label="Año de publicación" value={data.anio_publicacion} />
              <LibroInfoItem label="Ejemplares" value={data.cantidad_ejemplar} />
              <LibroInfoItem label="Facultad" value={data.facultad} />
              <LibroInfoItem label="Ciudad" value={data.ciudad} />
              <LibroInfoItem label="Carrera" value={data.carrera} full />
            </div>
          </div>
        </section>

        <section className="ejemplares-section">
          <details className="ejemplares-dropdown">
            <summary className="ejemplares-title">Ejemplares</summary>
            <div className="ejemplares-lista">
              {ejemplares.map((ejemplar, i) => (
                <EjemplarItem key={i} ejemplar={ejemplar} />
              ))}
            </div>
          </details>
        </section>
      </main>
      <FooterLogin />

    </div>
  )
}

export default LibroDetallePublic
