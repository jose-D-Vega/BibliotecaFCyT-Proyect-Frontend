import { createContext, useContext, useState, useCallback } from 'react'
import { getBookById } from '../services/books.services'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([])
  const [loadingLibro, setLoadingLibro] = useState(false)

  // Agrega o actualiza un libro en el carrito con cantidad y disponibilidad real
  const agregarAlCarrito = useCallback(async (libro, cantidadSolicitada = 1) => {
    const disponibles = parseInt(libro.ejemplares_disponibles) || 0
    const reservables = parseInt(libro.cantidad_ejemplar) - disponibles

    setCarrito(prev => {
      const existente = prev.find(item => item.id_libro === libro.id_libro)
      if (existente) {
        // Actualizar cantidad si ya existe
        return prev.map(item =>
          item.id_libro === libro.id_libro
            ? { ...item, cantidad: cantidadSolicitada }
            : item
        )
      }
      return [...prev, {
        id_libro: libro.id_libro,
        titulo: libro.titulo,
        autor: libro.autor,
        imagen_url: libro.imagen_url,
        cantidad: cantidadSolicitada,
        ejemplares_disponibles: disponibles,
        ejemplares_reservables: Math.max(reservables, 0),
        max_solicitables: parseInt(libro.cantidad_ejemplar) || 0
      }]
    })
  }, [])

  const actualizarCantidad = useCallback((id_libro, cantidad) => {
    setCarrito(prev =>
      prev.map(item =>
        item.id_libro === id_libro
          ? { ...item, cantidad: Math.max(1, cantidad) }
          : item
      )
    )
  }, [])

  const removerDelCarrito = useCallback((id_libro) => {
    setCarrito(prev => prev.filter(item => item.id_libro !== id_libro))
  }, [])

  const vaciarCarrito = useCallback(() => setCarrito([]), [])

  const estaEnCarrito = useCallback(
    (id_libro) => carrito.some(item => item.id_libro === id_libro),
    [carrito]
  )

  // Calcula cuántos van como préstamo y cuántos como reserva para un item
  const calcularDistribucion = useCallback((item) => {
    const prestamo = Math.min(item.cantidad, item.ejemplares_disponibles)
    const reserva = Math.max(0, item.cantidad - item.ejemplares_disponibles)
    return { prestamo, reserva }
  }, [])

  // Prepara el payload para el backend
  const buildPayload = useCallback(() => {
    return carrito.map(item => ({
      id_libro: item.id_libro,
      cantidad: item.cantidad
    }))
  }, [carrito])

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0)
  const hayReservas = carrito.some(item => item.cantidad > item.ejemplares_disponibles)

  return (
    <CartContext.Provider value={{
      carrito,
      loadingLibro,
      agregarAlCarrito,
      actualizarCantidad,
      removerDelCarrito,
      vaciarCarrito,
      estaEnCarrito,
      calcularDistribucion,
      buildPayload,
      totalItems,
      hayReservas
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider')
  return context
}