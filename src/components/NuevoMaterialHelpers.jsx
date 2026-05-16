export const onlyLettersRegex =
  /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/

export const onlyNumbersRegex =
  /^\d+$/

export const yearRegex =
  /^\d{4}$/

export const authorRegex =
  /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/

export const opcionesCarrera = [
  "General",
  "Informatica",
  "Electronica",
  "Electricidad",
  "Civil"
]

export const validateNuevoMaterial = ({
  form,
  carreras,
  autores
}) => {

  let errs = {}

  const autoresValidos =
    autores.filter(a => a.trim())

  // TIPO
  if (!form.tipo)
    errs.tipo =
      "Seleccione un tipo de material"

  // TITULO
  if (!form.titulo.trim()) {

    errs.titulo =
      "El título es obligatorio"

  } else if (
    form.titulo.trim().length < 3
  ) {

    errs.titulo =
      "El título debe tener al menos 3 caracteres"
  }

  // CARRERA
  if (carreras.length === 0)
    errs.carrera =
      "Seleccione al menos una carrera"

  // AUTORES
  if (autoresValidos.length === 0) {

    errs.autores =
      "Ingrese al menos un autor"

  } else {

    const autorInvalido =
      autoresValidos.some(
        autor => !authorRegex.test(autor)
      )

    if (autorInvalido)
      errs.autores =
        "Los autores solo pueden contener letras"

    const autoresDuplicados =
      new Set(
        autoresValidos.map(a =>
          a.trim().toLowerCase()
        )
      ).size !== autoresValidos.length

    if (autoresDuplicados)
      errs.autores =
        "No puede repetir autores"
  }

  // EDITORIAL
  if (!form.editorial.trim()) {

    errs.editorial =
      "La editorial es obligatoria"

  } else if (
    form.editorial.trim().length > 100
  ) {

    errs.editorial =
      "Máximo 100 caracteres"

  } else if (
    !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s.,-]+$/.test(
      form.editorial
    )
  ) {

    errs.editorial =
      "La editorial contiene caracteres inválidos"
  }

  // AÑO
  if (!form.anio.trim()) {

    errs.anio =
      "Ingrese el año de publicación"

  } else if (
    !onlyNumbersRegex.test(form.anio)
  ) {

    errs.anio =
      "El año solo debe contener números"

  } else if (
    !yearRegex.test(form.anio)
  ) {

    errs.anio =
      "El año debe tener exactamente 4 dígitos"

  } else {

    const year = Number(form.anio)

    const currentYear =
      new Date().getFullYear()

    if (year < 1000)
      errs.anio =
        "El año ingresado no es válido"

    else if (year > currentYear + 1)
      errs.anio =
        "El año no puede ser mayor al actual"
  }

  // CANTIDAD
  if (!form.cantidad.trim()) {

    errs.cantidad =
      "Ingrese la cantidad de ejemplares"

  } else if (
    !onlyNumbersRegex.test(form.cantidad)
  ) {

    errs.cantidad =
      "La cantidad solo debe contener números"

  } else if (
    Number(form.cantidad) < 1
  ) {

    errs.cantidad =
      "La cantidad mínima es 1"

  } else if (
    Number(form.cantidad) > 9999
  ) {

    errs.cantidad =
      "La cantidad máxima permitida es 9999"
  }

  // DESCRIPCION
  if (form.descripcion.length > 500)
    errs.descripcion =
      "La descripción no puede superar los 500 caracteres"

  // CIUDAD
  if (
    form.ciudad.trim() &&
    !onlyLettersRegex.test(form.ciudad)
  ) {

    errs.ciudad =
      "La ciudad solo puede contener letras"

  } else if (
    form.ciudad.length > 100
  ) {

    errs.ciudad =
      "Máximo 100 caracteres"
  }

  // FACULTAD
  if (
    form.facultad.trim() &&
    !onlyLettersRegex.test(form.facultad)
  ) {

    errs.facultad =
      "La facultad solo puede contener letras"

  } else if (
    form.facultad.length > 100
  ) {

    errs.facultad =
      "Máximo 100 caracteres"
  }

  return errs
}