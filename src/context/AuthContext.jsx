import { createContext, useContext, useEffect, useState } from 'react'
import { getMe } from '../services/auth.services'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [rolActivo, setRolActivo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      const savedRolActivo = localStorage.getItem('rolActivo')
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const userData = await getMe()
        setUser(userData)
        // Restaurar el rol activo de la sesión anterior si existe
        if (savedRolActivo) {
          setRolActivo(savedRolActivo)
        } else if (userData.rol === 'normal') {
          setRolActivo('normal')
          localStorage.setItem('rolActivo', 'normal')
        }
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('rolActivo')
        setUser(null)
        setRolActivo(null)
      } finally {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  const login = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    
  }

  const selectRol = (rol) => {
    localStorage.setItem('rolActivo', rol)
    setRolActivo(rol)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('rolActivo')
    setUser(null)
    setRolActivo(null)
  }
  const switchRol = () => {
    localStorage.removeItem('rolActivo')
    setRolActivo(null)
  }

  return (
    <AuthContext.Provider value={{ user, rolActivo, loading, login, selectRol, switchRol, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}