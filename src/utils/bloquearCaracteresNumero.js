// Handler para <input type="number"> que bloquea caracteres que el navegador
// permite pero no tienen sentido en nuestros filtros (año, IDs): notación
// científica ("e"/"E") y signos ("+", "-"). No usamos regex sobre el value
// porque en un input number el navegador ya limpia letras sueltas; el problema
// puntual es justamente "e", que sí es un dígito válido para floats en JS.
export const bloquearCaracteresNumero = (e) => {
  if (["e", "E", "+", "-"].includes(e.key)) {
    e.preventDefault()
  }
}

// Cubre el caso de pegar texto (Ctrl+V) con "e", "+" o "-" incluidos, que
// onKeyDown no puede interceptar. Extrae solo los dígitos del texto pegado
// e inserta eso en el input, en vez de dejar pasar el pegado tal cual.
export const sanitizarPegadoNumero = (e, onFiltroChange, filtroKey) => {
  e.preventDefault()
  const textoPegado = e.clipboardData.getData("text")
  const soloDigitos = textoPegado.replace(/[^0-9]/g, "")
  if (soloDigitos) onFiltroChange(filtroKey, soloDigitos)
}