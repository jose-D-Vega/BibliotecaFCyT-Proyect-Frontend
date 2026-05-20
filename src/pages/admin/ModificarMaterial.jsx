// ModificarMaterial.jsx

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  useState,
  useEffect,
  useRef
} from "react";

import "../../pages/styles/styles_admin/ModificarMaterial.css";
import { updateBook } from '../../services/books.services'

function ModificarMaterial() {

  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  /* REDIRECCIÓN SEGURA */
  useEffect(() => {
    if (!state) {
      navigate("/admin/catalogo", {
        replace: true
      });
    }
  }, [state, navigate]);

  /* ESTADOS */
  const [libro, setLibro] = useState(state || {});
  const [imagen, setImagen] = useState(null);

  const [preview, setPreview] = useState(
    state?.imagen_url || ""
  );

  const [errores, setErrores] = useState({});

  /* SELECT CARRERA */
  const [openCarrera, setOpenCarrera] =
    useState(false);

  const [carreras, setCarreras] = useState(
    libro.carrera
      ? libro.carrera.split(", ")
      : []
  );

  const opcionesCarrera = [
    "General",
    "Informatica",
    "Electronica",
    "Electricidad",
    "Civil"
  ];

  const carreraRef = useRef(null);

  /* CERRAR SELECT */
  useEffect(() => {

    const handleClickOutside = (e) => {

      if (
        carreraRef.current &&
        !carreraRef.current.contains(e.target)
      ) {
        setOpenCarrera(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  /* =========================
        HANDLE CHANGE
  ========================== */

  const handleChange = (e) => {

    const { name, value } = e.target;

    let nuevoValor = value;

    /* SOLO LETRAS */
    if (
      name === "autor" ||
      name === "ciudad" ||
      name === "facultad"
    ) { if (name === "autor") {
    // Para autor: permite letras, espacios, acentos, ñ y comas
    nuevoValor = value.replace(
      /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s,]/g,
      ""
    );
  } else {
    // Para ciudad y facultad: mantiene la validación original
    nuevoValor = value.replace(
      /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
      ""
    );
  }
    }

    /* SOLO NUMEROS */
    if (
      name === "cantidad_ejemplar" ||
      name === "anio_publicacion"
    ) {

      nuevoValor = value.replace(
        /[^0-9]/g,
        ""
      );
    }

    /* MAX 4 DIGITOS */
    if (name === "anio_publicacion") {
      nuevoValor = nuevoValor.slice(0, 4);
    }

    setLibro({
      ...libro,
      [name]: nuevoValor
    });

    /* LIMPIAR ERROR */
    setErrores({
      ...errores,
      [name]: ""
    });
  };

  /* =========================
        CARRERA
  ========================== */

  const handleCarreraSelect = (c) => {
  if (c === "General") {
    setCarreras(["General"]);
    return;
  }

  let updated = [...carreras].filter(x => x !== "General");

  if (updated.includes(c)) {
    // Si la carrera ya está seleccionada, la eliminamos
    updated = updated.filter(x => x !== c);
  } else {
    // Si no está seleccionada y tenemos menos de 3 carreras, la agregamos
    if (updated.length < 3) {
      updated.push(c);
    } else {
      console.log("No puedes seleccionar más de 3 carreras");
    }
  }

  setCarreras(updated);
};

  /* =========================
        IMAGEN
  ========================== */

  const handleImagen = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const tiposPermitidos = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp"
    ];

    if (
      !tiposPermitidos.includes(file.type)
    ) {

      setErrores({
        ...errores,
        imagen:
          "Solo PNG, JPG o WEBP"
      });

      return;
    }

    /* MAX 5MB */
    if (file.size > 5 * 1024 * 1024) {

      setErrores({
        ...errores,
        imagen:
          "La imagen supera 5MB"
      });

      return;
    }

    setImagen(file);

    setPreview(
      URL.createObjectURL(file)
    );

    setErrores({
      ...errores,
      imagen: ""
    });
  };

  /* =========================
        VALIDAR
  ========================== */

  const validarFormulario = () => {

    let nuevosErrores = {};

    /* TITULO */
    if (!libro.titulo?.trim()) {

      nuevosErrores.titulo =
        "Ingrese el título";

    } else if (
      libro.titulo.length < 3
    ) {

      nuevosErrores.titulo =
        "Mínimo 3 caracteres";
    }

    /* AUTOR */
    if (!libro.autor?.trim()) {

      nuevosErrores.autor =
        "Ingrese autor";
    }

    /* EDITORIAL */
    if (!libro.editorial?.trim()) {

      nuevosErrores.editorial =
        "Ingrese editorial";
    }

    /* AÑO */
    if (!libro.anio_publicacion) {

      nuevosErrores.anio_publicacion =
        "Ingrese el año";

    } else if (
      libro.anio_publicacion.length < 4 || libro.anio_publicacion.length > 4 
    ) {

      nuevosErrores.anio_publicacion =
        "Debe tener 4 dígitos";

    } else if (
      parseInt(
        libro.anio_publicacion
      ) < 1900 ||

      parseInt(
        libro.anio_publicacion
      ) > new Date().getFullYear()
    ) {

      nuevosErrores.anio_publicacion =
        "Año inválido";
    }

    /* EJEMPLARES */
    if (
      !libro.cantidad_ejemplar
    ) {

      nuevosErrores.cantidad_ejemplar =
        "Ingrese cantidad";

    } else if (
      parseInt(
        libro.cantidad_ejemplar
      ) < 0
    ) {

      nuevosErrores.cantidad_ejemplar =
        "Debe ingresar una cantidad válida de ejemplares";
    }

    /* CIUDAD */
    if (!libro.ciudad?.trim()) {

      nuevosErrores.ciudad =
        "Ingrese ciudad";
    }

    /* FACULTAD */
    if (!libro.facultad?.trim()) {

      nuevosErrores.facultad =
        "Ingrese facultad";
    }

    /* CARRERA */
    if (carreras.length === 0) {

      nuevosErrores.carrera =
        "Seleccione carrera";
    }

    setErrores(nuevosErrores);

    return (
      Object.keys(
        nuevosErrores
      ).length === 0
    );
  };

  /* =========================
        GUARDAR
  ========================== */

  const guardarCambios = async () => {
    if (!validarFormulario()) return

    try {
      setLoading(true)

      const formData = new FormData()

      formData.append('titulo', libro.titulo)
      formData.append('autor', libro.autor)
      formData.append('editorial', libro.editorial || '')
      formData.append('anio_publicacion', libro.anio_publicacion)
      formData.append('cantidad_ejemplar', libro.cantidad_ejemplar)
      formData.append('ciudad', libro.ciudad || '')
      formData.append('facultad', libro.facultad || '')
      formData.append('tipo_material', libro.tipo_material || '')
      formData.append('carrera', carreras.join(', '))

      if (imagen) {
        formData.append('imagen', imagen)
      }

      await updateBook(libro.id_libro, formData)
      navigate('/admin/catalogo')
    } catch (err) {
      setErrores({
        ...errores,
        submit: err.response?.data?.error || 'Error al guardar los cambios'
      })
    } finally {
      setLoading(false)
    }
  }

  if (!state) return null;

  return (

    <div className="contenedor">

      {/* HEADER */}
      <header className="detalle-header-modificarLibro">

        <button
          className="btn-volver"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        <h2>Modificar Libro</h2>

      </header>

      {/* INFO */}
      <div className="info-actual-mini">

        <p>
          <b>Editando:</b>{" "}
          {state.titulo}
        </p>

      </div>

      {/* FORM */}
      <div className="form-modificar">

        {/* TITULO */}
        <div className="campo">

          <label>Título</label>

          <input
            name="titulo"
            value={libro.titulo || ""}
            onChange={handleChange}
          />

          {errores.titulo && (
            <span className="error">
              {errores.titulo}
            </span>
          )}

        </div>

        {/* AUTOR */}
        <div className="campo">

          <label>Autor(es)</label>

          <input
            name="autor"
            value={libro.autor || ""}
            onChange={handleChange}
          />

          {errores.autor && (
            <span className="error">
              {errores.autor}
            </span>
          )}

        </div>

        {/* FILA 2 */}
        <div className="form-row-2">

          {/* EDITORIAL */}
          <div className="campo">

            <label>Editorial</label>

            <input
              name="editorial"
              value={libro.editorial || ""}
              onChange={handleChange}
            />

            {errores.editorial && (
              <span className="error">
                {errores.editorial}
              </span>
            )}

          </div>

          {/* AÑO */}
          <div className="campo">

            <label>
              Año de publicación
            </label>

            <input
              type="text"
              name="anio_publicacion"
              value={
                libro.anio_publicacion || ""
              }
              onChange={handleChange}
              maxLength={4}
            />

            {errores.anio_publicacion && (
              <span className="error">
                {
                  errores.anio_publicacion
                }
              </span>
            )}

          </div>

        </div>

        {/* FILA 3 */}
        <div className="form-row-3">

          {/* EJEMPLARES */}
          <div className="campo">

            <label>
              Cantidad de ejemplares
            </label>

            <input
              type="number"
              name="cantidad_ejemplar"
              value={
                libro.cantidad_ejemplar || ""
              }
              onChange={handleChange}
            />

            {errores.cantidad_ejemplar && (
              <span className="error">
                {
                  errores.cantidad_ejemplar
                }
              </span>
            )}

          </div>

          {/* CIUDAD */}
          <div className="campo">

            <label>Ciudad</label>

            <input
              name="ciudad"
              value={libro.ciudad || ""}
              onChange={handleChange}
            />

            {errores.ciudad && (
              <span className="error">
                {errores.ciudad}
              </span>
            )}

          </div>

          {/* FACULTAD */}
          <div className="campo">

            <label>Facultad</label>

            <input
              name="facultad"
              value={libro.facultad || ""}
              onChange={handleChange}
            />

            {errores.facultad && (
              <span className="error">
                {errores.facultad}
              </span>
            )}

          </div>

        </div>

        {/* CARRERA */}
        <div className="campo">

          <label>Carrera</label>

          <div
            className="custom-select"
            ref={carreraRef}
            onClick={() =>
              setOpenCarrera(
                !openCarrera
              )
            }
          >

            <div className="selected">

              {carreras.length === 0
                ? "Seleccione"
                : carreras.join(", ")}

            </div>

            <div className={`options ${
              openCarrera
                ? "open"
                : ""
            }`}>

              {opcionesCarrera.map((c) => (

                <div
                  key={c}
                  className={
                    carreras.includes(c)
                      ? "active-option"
                      : ""
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCarreraSelect(c);
                  }}
                >
                  {c}
                </div>

              ))}

            </div>

          </div>

          {errores.carrera && (
            <span className="error">
              {errores.carrera}
            </span>
          )}

        </div>

        {/* IMAGEN */}

          <div className="campo">

            <label>Imagen de portada</label>

            <div className="upload-container">

              <label className="custom-file-upload">
                Seleccionar imagen

                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  onChange={handleImagen}
                  hidden
                />
              </label>

              {preview && (
                <div className="preview-seccion">
                  <img
                    src={preview}
                    alt="Preview"
                  />
                </div>
              )}

            </div>

            {errores.imagen && (
              <span className="error">
                {errores.imagen}
              </span>
            )}

          </div>

          {errores.submit && (
            <p className="submit-errorM">
              {errores.submit}
            </p>
          )}

        {/* BOTONES */}
        <div className="acciones-finales">

          <button
            className="btn-confirmar"
            onClick={guardarCambios}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Confirmar cambios'}
          </button>

          <button
            className="btn-cancelar"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>

        </div>

      </div>

    </div>
  );
}

export default ModificarMaterial;