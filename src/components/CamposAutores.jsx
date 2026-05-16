import "./styles/CamposAutores.css"

function CamposAutores({
  autores,
  setAutores,
  error,
  clearError,
  regex
}) {

  const handleChange = (index, value) => {

    if (
      value !== "" &&
      !regex.test(value)
    ) {
      return
    }

    const nuevos = [...autores]

    nuevos[index] = value

    setAutores(nuevos)

    clearError("autores")
  }

  const addAutor = () => {
    setAutores([...autores, ""])
  }

  const removeAutor = (index) => {
    setAutores(
      autores.filter((_, i) => i !== index)
    )
  }

  return (
    <div className="form-group">

      <label>Autor(es)</label>

      {autores.map((autor, i) => (

        <div
          key={i}
          className="autor-row"
        >

          <input
            value={autor}
            maxLength={80}
            placeholder={`Autor ${i + 1}`}
            onChange={(e) =>
              handleChange(i, e.target.value)
            }
          />

          {autores.length > 1 && (
            <button
              type="button"
              onClick={() => removeAutor(i)}
            >
              ✕
            </button>
          )}

        </div>

      ))}

      {error && (
        <span className="error-msg">
          {error}
        </span>
      )}

      <button
        type="button"
        className="btn-secondary add-autor"
        onClick={addAutor}
      >
        + Añadir autor
      </button>

    </div>
  )
}

export default CamposAutores