import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../../pages/styles/NuevoMaterial.css"

function NuevoMaterial() {
  const navigate = useNavigate()

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

  const [autores, setAutores] = useState([""])
  const [preview, setPreview] = useState(null)
  const [errors, setErrors] = useState({})

  const [openTipo, setOpenTipo] = useState(false)
  const [openCarrera, setOpenCarrera] = useState(false)

  const [carreras, setCarreras] = useState([])

  const opcionesCarrera = [
    "General",
    "Informatica",
    "Electronica",
    "Electricidad",
    "Civil"
  ]

  // 🔥 refs para detectar click afuera
  const tipoRef = useRef(null)
  const carreraRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tipoRef.current && !tipoRef.current.contains(e.target)) {
        setOpenTipo(false)
      }

      if (carreraRef.current && !carreraRef.current.contains(e.target)) {
        setOpenCarrera(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleTipoSelect = (value) => {
    setForm({ ...form, tipo: value })
    setOpenTipo(false)
  }

  const handleCarreraSelect = (c) => {
    if (c === "General") {
      setCarreras(["General"])
      return
    }

    let updated = [...carreras]
    updated = updated.filter(x => x !== "General")

    if (updated.includes(c)) {
      updated = updated.filter(x => x !== c)
    } else {
      updated.push(c)
    }

    setCarreras(updated)
  }

  const handleAutorChange = (index, value) => {
    const nuevos = [...autores]
    nuevos[index] = value
    setAutores(nuevos)
  }

  const addAutor = () => setAutores([...autores, ""])
  const removeAutor = (index) => setAutores(autores.filter((_, i) => i !== index))

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setForm({ ...form, imagen: file })
    setPreview(URL.createObjectURL(file))
  }

  const validate = () => {
    let errs = {}

    if (!form.tipo) errs.tipo = "Seleccione un tipo"
    if (!form.titulo.trim()) errs.titulo = "Ingrese título"

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    console.log({
      ...form,
      autores: autores.join(", "),
      carreras
    })
  }

  return (
    <div className="nuevo-material-page">
      <div className="nuevo-material-content">

        <div className="header">
          <h1>Añadir nuevo material</h1>
          <button className="btn-secondary" onClick={() => navigate("/admin/catalogo")}>
            ← Volver
          </button>
        </div>

        <form className="nuevo-material-form" onSubmit={handleSubmit}>

          {/* TIPO */}
          <div className="form-group">
            <label>Tipo de material</label>

            <div
              className="custom-select"
              ref={tipoRef}
              onClick={() => setOpenTipo(!openTipo)}
            >
              <div className="selected">
                {form.tipo === "libro"
                  ? "Libro"
                  : form.tipo === "tfg"
                  ? "TFG (Trabajo Final de Grado)"
                  : "Seleccione"}
              </div>

              <div className={`options ${openTipo ? "open" : ""}`}>
                <div onClick={() => handleTipoSelect("libro")}>Libro</div>
                <div onClick={() => handleTipoSelect("tfg")}>TFG (Trabajo Final de Grado)</div>
              </div>
            </div>
          </div>

          {/* TITULO */}
          <div className="form-group">
            <label>Título</label>
            <input name="titulo" placeholder="Ej: Cálculo Diferencial e Integral" onChange={handleChange}/>
          </div>

          {/* CARRERA */}
          <div className="form-group">
            <label>Carrera</label>

            <div
              className="custom-select"
              ref={carreraRef}
              onClick={() => setOpenCarrera(!openCarrera)}
            >
              <div className="selected">
                {carreras.length === 0 ? "Seleccione" : carreras.join(", ")}
              </div>

              <div className={`options ${openCarrera ? "open" : ""}`}>
                {opcionesCarrera.map((c) => (
                  <div
                    key={c}
                    className={carreras.includes(c) ? "active-option" : ""}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCarreraSelect(c)
                    }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RESTO IGUAL */}
          <div className="form-group">
            <label>Autor(es)</label>

            {autores.map((autor, i) => (
              <div key={i} className="autor-row">
                <input
                  value={autor}
                  placeholder={`Autor ${i + 1}`}
                  onChange={(e) => handleAutorChange(i, e.target.value)}
                />
                {autores.length > 1 && (
                  <button type="button" onClick={() => removeAutor(i)}>✕</button>
                )}
              </div>
            ))}

            <button type="button" className="btn-secondary add-autor" onClick={addAutor}>
              + Añadir autor
            </button>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Editorial</label>
              <input name="editorial" placeholder="Ej: McGraw-Hill" onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Año de publicación</label>
              <input type="number" name="anio" placeholder="Ej: 2020" onChange={handleChange}/>
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              placeholder="Escribe aquí la descripción del material"
              onChange={handleChange}
            />
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label>Cantidad de ejemplares</label>
              <input type="number" min="1" name="cantidad" placeholder="Ej: 5" onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Ciudad</label>
              <input name="ciudad" placeholder="Ej: Asunción" onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Facultad</label>
              <input name="facultad" placeholder="Ej: FCyT" onChange={handleChange}/>
            </div>
          </div>

          <div className="form-group">
            <label>Imagen de portada</label>

            <label className="file-input">
              Seleccionar imagen
              <input type="file" accept="image/*" onChange={handleImage}/>
            </label>

            {preview && (
              <div className="preview">
                <img src={preview} alt="preview"/>
                <span>{form.imagen?.name}</span>
              </div>
            )}
          </div>

          <button className="btn-primary">
            Añadir material
          </button>

        </form>
      </div>
    </div>
  )
}

export default NuevoMaterial