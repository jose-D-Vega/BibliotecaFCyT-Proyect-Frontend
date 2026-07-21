import { createContext, useContext, useEffect, useState } from 'react'
import { getMe, cerrarSesion } from '../services/auth.services'


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

        // Validamos que el rolActivo guardado sea compatible con ESTE usuario.
        // Si el usuario es 'normal', su único rolActivo válido es 'normal'.
        // Si es de gestión ('admin' o 'bibliotecario'), el rolActivo guardado
        // tiene que coincidir exactamente con su rol real.
        const rolGuardadoEsValido =
          savedRolActivo &&
          (
            (userData.rol === 'normal' && savedRolActivo === 'normal') ||
            (userData.rol !== 'normal' && savedRolActivo === userData.rol)
          )

        if (rolGuardadoEsValido) {

          setRolActivo(savedRolActivo)

        } else if (userData.rol === 'normal') {

          setRolActivo('normal')
          localStorage.setItem('rolActivo', 'normal')

        } else {

          // Rol guardado no corresponde a este usuario (sesión de otro usuario/rol) → limpiar
          localStorage.removeItem('rolActivo')
          setRolActivo(null)

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

    // Limpiamos cualquier rolActivo de una sesión anterior (de este u otro usuario)
    // para que el flujo de selección de rol se evalúe siempre de cero.
    localStorage.removeItem('rolActivo')
    setRolActivo(null)

    setUser(userData)

  }


  const selectRol = (rol) => {

    localStorage.setItem('rolActivo', rol)
    setRolActivo(rol)

  }


  const logout = async () => {

    try {
      await cerrarSesion()
    } catch (error) {
      console.error('Error cerrando sesión:', error)
    } finally {

      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('rolActivo')

      setUser(null)
      setRolActivo(null)

    }

  }


  const switchRol = () => {

    localStorage.removeItem('rolActivo')
    setRolActivo(null)

  }


  const refreshUser = async () => {

    try {

      const userData = await getMe()
      setUser(userData)

    } catch {

      logout()

    }

  }


  return (
    <AuthContext.Provider
      value={{
        user,
        rolActivo,
        loading,
        login,
        selectRol,
        switchRol,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )

}


export const useAuth = () => {

  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return context

}