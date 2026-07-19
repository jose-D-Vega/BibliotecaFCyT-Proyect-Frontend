import { useRef } from "react"
import "./styles/InputImagen.css"

function InputImagen({
  imagen,
  setImagen,
  preview,
  setPreview,
  error,
  clearError
}) {

  const inputRef = useRef(null)

  const handleImage = (e) => {

    const file = e.target.files[0]

    if (!file) return

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg"
    ]

    if (
      !allowedTypes.includes(file.type)
    ) {

      return
    }

    clearError("imagen")

    setImagen(file)

    setPreview(
      URL.createObjectURL(file)
    )
  }

  const removeImage = () => {

    setImagen(null)

    setPreview(null)

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="form-group">

      <label>
        Imagen de portada
      </label>

      <label
        className={`file-input ${
          imagen ? "disabled" : ""
        }`}
        style={{
          opacity: imagen ? 0.6 : 1,
          pointerEvents:
            imagen ? "none" : "auto"
        }}
      >

        Seleccionar imagen

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleImage}
        />

      </label>

      {error && (
        <span className="error-msg">
          {error}
        </span>
      )}

      {preview && (

        <div className="preview">

          <img
            src={preview}
            alt="preview"
          />

          <span>
            {imagen?.name}
          </span>

          <div
            className="autor-row"
            style={{
              marginBottom: 0
            }}
          >

            <button
              type="button"
              onClick={removeImage}
            >
              ✕
            </button>

          </div>

        </div>

      )}

    </div>
  )
}

export default InputImagen