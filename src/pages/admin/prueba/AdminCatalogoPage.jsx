import { useNavigate } from 'react-router-dom'
import CatalogoAdmin from '../CatalogoAdmin'

function AdminCatalogoPage() {
  const navigate = useNavigate()

  return (
    <CatalogoAdmin
      onVerDetalle={(libro) => navigate(`/admin/catalogo/${libro.id_libro}`)}
      onNuevoLibro={() => navigate('/admin/catalogo/nuevo')}
    />
  )
}

export default AdminCatalogoPage