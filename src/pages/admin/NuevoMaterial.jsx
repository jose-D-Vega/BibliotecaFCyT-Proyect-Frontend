import { useState } from "react"
import { useNavigate } from "react-router-dom"

import "../styles/styles_admin/prueba/NuevoMaterialPrueba.css"

import { createBook } from "../../services/books.services"

import ModalExito from "../../components/ModalExito"
import SelectPersonalizado from "../../components/SelectPersonalizado"
import CamposAutores from "../../components/CamposAutores"
import InputImagen from "../../components/InputImagen"

import {
  opcionesCarrera,
  validateNuevoMaterial,
  onlyLettersRegex,
  onlyNumbersRegex,
  authorRegex
} from "../../components/nuevoMaterialHelpers"

function NuevoMaterial() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [successModal, setSuccessModal] =
    useState(false)

  const [errors, setErrors] = useState({})

  const [preview, setPreview] =
    useState(null)

  const [autores, setAutores] =
    useState([""])

  const [carreras, setCarreras] =
    useState([])

  const [form, setForm] = useState({
    tipo: "",
    titulo: "",
    descripcion: "",
    cantidad: "",
    ciudad: "",
    facultad: "",
    editorial: "",
    anio: "",
    imagen: null
  })

  const clearError = (field) => {

    setErrors(prev => ({
      ...prev,
      [field]: "",
      submit: ""
    }))
  }

  const handleChange = ({
    target: { name, value }
  }) => {

    if (
      ["anio", "cantidad"].includes(name) &&
      value &&
      !onlyNumbersRegex.test(value)
    ) {
      return
    }

    if (
      ["ciudad", "facultad"].includes(name) &&
      value &&
      !onlyLettersRegex.test(value)
    ) {
      return
    }

    setForm(prev => ({
      ...prev,
      [name]: value
    }))

    clearError(name)
  }

  const handleCarrera = (c) => {

    if (c === "General") {
      setCarreras(["General"])
      return
    }

    let updated =
      carreras.filter(x => x !== "General")

    updated = updated.includes(c)
      ? updated.filter(x => x !== c)
      : [...updated, c]

    setCarreras(updated)

    clearError("carrera")
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    const errs =
      validateNuevoMaterial({
        form,
        carreras,
        autores
      })

    setErrors(errs)

    if (Object.keys(errs).length > 0) {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })

      return
    }

    try {

      setLoading(true)

      const formData = new FormData()

      formData.append(
        "titulo",
        form.titulo.trim()
      )

      formData.append(
        "autor",
        autores
          .filter(a => a.trim())
          .join(", ")
      )

      formData.append(
        "tipo_material",
        form.tipo
      )

      formData.append(
        "anio_publicacion",
        form.anio
      )

      formData.append(
        "cantidad_ejemplar",
        form.cantidad
      )

      formData.append(
        "editorial",
        form.editorial.trim()
      )

      formData.append(
        "ciudad",
        form.ciudad.trim()
      )

      formData.append(
        "facultad",
        form.facultad.trim()
      )

      formData.append(
        "descripcion",
        form.descripcion.trim()
      )

      if (carreras.length > 0) {
        formData.append(
          "carrera",
          carreras.join(", ")
        )
      }

      if (form.imagen) {
        formData.append(
          "imagen",
          form.imagen
        )
      }

      await createBook(formData)

      setSuccessModal(true)

    } catch (err) {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })

      setErrors({
        submit:
          err.response?.data?.error ||
          "Error al guardar el material. Intentá de nuevo."
      })

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="nuevo-material-page">

      <ModalExito
        open={successModal}
        onClose={() => {
          setSuccessModal(false)
          navigate("/admin/catalogo")
        }}
      />

      <div className="nuevo-material-content">

        <div className="header">

          <button
            className="btn-secondary"
            onClick={() =>
              navigate("/admin/catalogo")
            }
          >
            ← Volver
          </button>

          <h1>
            Añadir nuevo material
          </h1>

        </div>

        <form
          className="nuevo-material-form"
          onSubmit={handleSubmit}
        >

          <SelectPersonalizado
            label="Tipo de material"
            value={
              form.tipo === "libro"
                ? "Libro"
                : form.tipo === "tfg"
                ? "TFG (Trabajo Final de Grado)"
                : ""
            }
            options={[
              {
                label: "Libro",
                value: "libro"
              },
              {
                label:
                  "TFG (Trabajo Final de Grado)",
                value: "tfg"
              }
            ]}
            onChange={(value) =>
              setForm(prev => ({
                ...prev,
                tipo: value
              }))
            }
            error={errors.tipo}
          />

          <div className="form-group">

            <label>Título</label>

            <input
              name="titulo"
              value={form.titulo}
              maxLength={120}
              placeholder="Ej: Cálculo Diferencial e Integral"
              onChange={handleChange}
            />

            {errors.titulo && (
              <span className="error-msg">
                {errors.titulo}
              </span>
            )}

          </div>

          <SelectPersonalizado
            label="Carrera"
            multiple
            value={carreras}
            options={opcionesCarrera.map(c => ({
              label: c,
              value: c
            }))}
            onChange={handleCarrera}
            error={errors.carrera}
          />

          <CamposAutores
            autores={autores}
            setAutores={setAutores}
            error={errors.autores}
            clearError={clearError}
            regex={authorRegex}
          />

          <div className="form-row-2">

            {[
              {
                label: "Editorial",
                name: "editorial",
                max: 100,
                placeholder:
                  "Ej: McGraw-Hill"
              },
              {
                label:
                  "Año de publicación",
                name: "anio",
                max: 4,
                placeholder: "Ej: 2020"
              }
            ].map(field => (

              <div
                className="form-group"
                key={field.name}
              >

                <label>
                  {field.label}
                </label>

                <input
                  name={field.name}
                  value={form[field.name]}
                  maxLength={field.max}
                  placeholder={
                    field.placeholder
                  }
                  onChange={handleChange}
                />

                {errors[field.name] && (
                  <span className="error-msg">
                    {errors[field.name]}
                  </span>
                )}

              </div>

            ))}

          </div>

          <div className="form-group">

            <label>Descripción</label>

            <textarea
              name="descripcion"
              value={form.descripcion}
              maxLength={500}
              placeholder="Escribe aquí la descripción del material"
              onChange={handleChange}
            />

            {errors.descripcion && (
              <span className="error-msg">
                {errors.descripcion}
              </span>
            )}

          </div>

          <div className="form-row-3">

            {[
              {
                label:
                  "Cantidad de ejemplares",
                name: "cantidad",
                max: 4,
                placeholder: "Ej: 5"
              },
              {
                label: "Ciudad",
                name: "ciudad",
                max: 100,
                placeholder:
                  "Ej: Asunción"
              },
              {
                label: "Facultad",
                name: "facultad",
                max: 100,
                placeholder: "Ej: FCyT"
              }
            ].map(field => (

              <div
                className="form-group"
                key={field.name}
              >

                <label>
                  {field.label}
                </label>

                <input
                  name={field.name}
                  value={form[field.name]}
                  maxLength={field.max}
                  placeholder={
                    field.placeholder
                  }
                  onChange={handleChange}
                />

                {errors[field.name] && (
                  <span className="error-msg">
                    {errors[field.name]}
                  </span>
                )}

              </div>

            ))}

          </div>

          <InputImagen
            imagen={form.imagen}
            setImagen={(img) =>
              setForm(prev => ({
                ...prev,
                imagen: img
              }))
            }
            preview={preview}
            setPreview={setPreview}
            error={errors.imagen}
            clearError={clearError}
          />

          {errors.submit && (
            <p className="submit-error">
              {errors.submit}
            </p>
          )}

          <button
            className="btn-primary"
            disabled={loading}
          >
            {loading
              ? "Guardando..."
              : "Añadir material"}
          </button>

        </form>

      </div>

    </div>
  )
}

export default NuevoMaterial