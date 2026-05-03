import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([])

  const agregarAlCarrito = (libro) => {
    setCarrito(prev => {
      const yaExiste = prev.some(item => item.id_libro === libro.id_libro)
      if (yaExiste) return prev
      return [...prev, libro]
    })
  }

  const removerDelCarrito = (id_libro) => {
    setCarrito(prev => prev.filter(item => item.id_libro !== id_libro))
  }

  const vaciarCarrito = () => setCarrito([])

  const estaEnCarrito = (id_libro) => carrito.some(item => item.id_libro === id_libro)

  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito, removerDelCarrito, vaciarCarrito, estaEnCarrito }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider')
  return context
}