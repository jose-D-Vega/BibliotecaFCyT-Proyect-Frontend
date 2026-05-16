import { useEffect, useRef, useState } from "react"
import "./styles/SelectPersonalizado.css"

function SelectPersonalizado({
  label,
  placeholder = "Seleccione",
  value,
  options,
  multiple = false,
  onChange,
  error
}) {

  const [open, setOpen] = useState(false)

  const selectRef = useRef(null)

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (
        selectRef.current &&
        !selectRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    )

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      )

  }, [])

  const displayValue = () => {

    if (multiple) {
      return value.length
        ? value.join(", ")
        : placeholder
    }

    return value || placeholder
  }

  return (
    <div className="form-group">

      <label>{label}</label>

      <div
        className="custom-select"
        ref={selectRef}
        onClick={() => setOpen(!open)}
      >

        <div
          className={`selected ${
            !value ||
            (Array.isArray(value) &&
              value.length === 0)
              ? "placeholder"
              : ""
          }`}
        >
          {displayValue()}
        </div>

        <div
          className={`options ${
            open ? "open" : ""
          }`}
        >

          {options.map(option => (

            <div
              key={option.value}
              className={
                multiple &&
                value.includes(option.value)
                  ? "active-option"
                  : ""
              }
              onClick={(e) => {

                e.stopPropagation()

                onChange(option.value)
              }}
            >
              {option.label}
            </div>

          ))}

        </div>

      </div>

      {error && (
        <span className="error-msg">
          {error}
        </span>
      )}

    </div>
  )
}

export default SelectPersonalizado