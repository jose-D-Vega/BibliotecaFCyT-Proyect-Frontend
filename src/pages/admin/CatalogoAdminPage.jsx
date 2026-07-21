import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import CatalogoAdmin from '../../components/catalogo/CatalogoAdmin'
import "./styles/CatalogoAdmin.css"

function AdminCatalogoPage() {
  const navigate = useNavigate()
  const { rolActivo } = useAuth()

  const prefijo =
    rolActivo === "bibliotecario"
      ? "/bibliotecario"
      : "/admin"

  return (
    <CatalogoAdmin
      onVerDetalle={(libro) =>
        navigate(`${prefijo}/catalogo/${libro.id_libro}`)
      }
      onNuevoLibro={() =>
        navigate(`${prefijo}/catalogo/nuevo`)
      }
    />
  )
}

export default AdminCatalogoPage