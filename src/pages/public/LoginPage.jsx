import { getGoogleLoginUrl } from '../../services/auth.services'

const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.location.href = getGoogleLoginUrl()
  }

  return (
    <div>
      <h1>Biblioteca FCyT</h1>
      <p>Iniciá sesión con tu cuenta institucional</p>
      <button onClick={handleGoogleLogin}>
        Iniciar sesión con Google
      </button>
      <p>
        ¿No tenés cuenta institucional?{' '}
        <a href="/catalogo">Ver catálogo sin iniciar sesión</a>
      </p>
    </div>
  )
}

export default LoginPage