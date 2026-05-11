import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../components/styles/ModificarLibros.css";

function ModificarLibro() {
  const { state } = useLocation(); // Recibe el libro desde LibroDetalleAdmin
  const navigate = useNavigate();

  // 1. SEGURIDAD: Si no hay estado (ej. refresh de página), volvemos al catálogo
  // Esto evita que la app explote al intentar leer libro.titulo
  useEffect(() => {
    if (!state) {
      navigate("/admin/catalogo", { replace: true });
    }
  }, [state, navigate]);

  const [libro, setLibro] = useState(state || {});
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setLibro({ ...libro, [e.target.name]: e.target.value });
  };

  const handleImagen = (e) => {
    const file = e.target.files[0];
    setImagen(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const guardarCambios = () => {
    // Aquí iría tu lógica de actualización (Fetch a tu API)
    console.log("Datos modificados:", libro);
    console.log("Imagen nueva:", imagen);

    alert("Cambios guardados correctamente");
    
    // 2. RETORNO: Después de guardar, volvemos al catálogo
    navigate("/admin/catalogo");
  };

  // Si no hay libro (mientras actúa el useEffect), no renderizamos nada
  if (!state) return null;

  return (
    <div className="contenedor">
      <header className="detalle-header">
        <button className="btn-volver" onClick={() => navigate(-1)}>
          ← Cancelar y Volver
        </button>
        <h2>Modificar Libro</h2>
      </header>

      <div className="info-actual-mini">
        <p><b>Editando:</b> {state.titulo}</p>
      </div>

      <hr />

      <div className="form-modificar">
        <div className="campo">
          <label>Título:</label>
          <input name="titulo" value={libro.titulo} onChange={handleChange} />
        </div>

        <div className="campo">
          <label>Autor(es):</label>
          <input name="autor" value={libro.autor} onChange={handleChange} />
        </div>

        <div className="campo">
          <label>Editorial:</label>
          <input name="editorial" value={libro.editorial} onChange={handleChange} />
        </div>

        <div className="campo">
          <label>Cantidad (Ejemplares):</label>
          <input name="ejemplares" type="number" value={libro.ejemplares} onChange={handleChange} />
        </div>

        <div className="campo">
          <label>Ciudad:</label>
          <input name="ciudad" value={libro.ciudad} onChange={handleChange} />
        </div>

        <div className="campo">
          <label>Facultad:</label>
          <input name="facultad" value={libro.facultad} onChange={handleChange} />
        </div>

        <div className="campo">
          <label>Imagen de Portada:</label>
          <input type="file" accept="image/*" onChange={handleImagen} />
        </div>

        {preview && (
          <div className="preview-seccion">
            <p>Nueva vista previa:</p>
            <img src={preview} width="120" alt="Vista previa" />
          </div>
        )}

        <div className="acciones-finales">
          <button className="btn-confirmar" onClick={guardarCambios}>
            Confirmar cambios
          </button>
          <button className="btn-cancelar" onClick={() => navigate(-1)}>
            Descartar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModificarLibro;