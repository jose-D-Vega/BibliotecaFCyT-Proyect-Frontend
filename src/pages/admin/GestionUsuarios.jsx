import React, { useState, useMemo, useEffect } from "react"
import { Users, UserCheck, ShieldAlert } from "lucide-react"
import "./styles/GestionUsuarios.css" 

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [tiposUsuario, setTiposUsuario] = useState([]) 
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [filtroActivo, setFiltroActivo] = useState("Todos")
  
  // Control de edición inline
  const [editandoId, setEditandoId] = useState(null)
  const [cambiosPendientes, setCambiosPendientes] = useState({})

  // Control del modal de confirmación
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null)

  const API_URL = "http://localhost:3210/api/users"
  const token = localStorage.getItem("token") 

  const headers = useMemo(() => ({
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }), [token])

  // 1. CARGAR DATOS DESDE EL BACKEND
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resRoles = await fetch(`${API_URL}/tipos`, { headers })
        const jsonRoles = await resRoles.json()
        setTiposUsuario(Array.isArray(jsonRoles.data) ? jsonRoles.data : [])

        const resUsers = await fetch(API_URL, { headers })
        const jsonUsers = await resUsers.json()
        // Normalizamos "activo" para que siempre sea booleano,
        // sin importar si el backend manda true/false o "true"/"false"
        const usuariosNormalizados = Array.isArray(jsonUsers.data)
          ? jsonUsers.data.map(u => ({
              ...u,
              activo: u.activo === true || u.activo === 'true',
              sancionado: u.sancionado === true || u.sancionado === 'true'
            }))
          : []
        setUsuarios(usuariosNormalizados)

        loading && setLoading(false)
      } catch (err) {
        console.error("Error al sincronizar con el backend:", err)
        setLoading(false)
      }
    }
    cargarDatos()
  }, [headers])

  const chips = ["Todos", "Activos", "Inactivos", "Bibliotecarios", "Usuarios", "Sancionados"]

  // CALCULAR TOTALES REALES
  const estadisticas = useMemo(() => {
    return {
      total: usuarios.length,
      activos: usuarios.filter(u => u.activo === true).length,
      sancionados: usuarios.filter(u => u.sancionado === true).length
    }
  }, [usuarios])

  // FILTRADO DINÁMICO
  const usuariosFiltrados = useMemo(() => {
    let lista = [...usuarios]
    
    if (filtroActivo === "Activos") {
      lista = lista.filter((u) => u.activo === true)
    } else if (filtroActivo === "Inactivos") {
      lista = lista.filter((u) => u.activo === false)
    } else if (filtroActivo === "Bibliotecarios") {
      lista = lista.filter((u) => u.rol?.toLowerCase() === "bibliotecario")
    } else if (filtroActivo === "Usuarios") {
      lista = lista.filter((u) => u.rol?.toLowerCase() === "usuario" || u.rol?.toLowerCase() === "normal")
    } else if (filtroActivo === "Sancionados") {
      lista = lista.filter((u) => u.sancionado === true)
    }

    if (busqueda.trim() !== "") {
      const q = busqueda.toLowerCase()
      lista = lista.filter((u) =>
        (u.nombre_apellido || "").toLowerCase().includes(q) ||
        (u.ci ? u.ci.toLowerCase().includes(q) : false) ||
        (u.correo || "").toLowerCase().includes(q)
      )
    }
    return lista
  }, [usuarios, filtroActivo, busqueda])

  const handleEditarClick = (usuario) => {
    setEditandoId(usuario.id_usuario)
    setCambiosPendientes({
      id_tipo_usuario: usuario.id_tipo_usuario,
      activo: usuario.activo,
      telefono: usuario.telefono
    })
  }

  // 2. GUARDAR ACTUALIZACIONES
  const handleGuardar = async (id_usuario, usuarioOriginal) => {
    try {
      let huboError = false

      if (cambiosPendientes.id_tipo_usuario !== usuarioOriginal.id_tipo_usuario) {
        const res = await fetch(`${API_URL}/${id_usuario}/rol`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ id_tipo_usuario: parseInt(cambiosPendientes.id_tipo_usuario) })
        })
        if (!res.ok) huboError = true
      }

      if (cambiosPendientes.activo !== usuarioOriginal.activo) {
        const res = await fetch(`${API_URL}/${id_usuario}/activo`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ activo: cambiosPendientes.activo })
        })
        if (!res.ok) huboError = true
      }

      if (cambiosPendientes.telefono !== usuarioOriginal.telefono) {
        const res = await fetch(`${API_URL}/${id_usuario}/telefono`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ telefono: cambiosPendientes.telefono })
        })
        if (!res.ok) huboError = true
      }

      if (huboError) {
        console.error("Algunas actualizaciones no se pudieron procesar correctamente")
        return
      }

      const rolSeleccionado = tiposUsuario.find(t => t.id_tipo_usuario === parseInt(cambiosPendientes.id_tipo_usuario))
      setUsuarios((prev) =>
        prev.map((u) => (u.id_usuario === id_usuario ? { 
          ...u, 
          id_tipo_usuario: cambiosPendientes.id_tipo_usuario,
          rol: rolSeleccionado ? rolSeleccionado.nombre_tipo : u.rol,
          activo: cambiosPendientes.activo,
          telefono: cambiosPendientes.telefono 
        } : u))
      )
      setEditandoId(null)
    } catch (error) {
      console.error("Error al procesar las actualizaciones:", error)
    }
  }

  // 3. ABRIR MODAL DE CONFIRMACIÓN PARA ELIMINAR
  const handleAbrirConfirmacion = (usuario) => {
    setUsuarioAEliminar(usuario)
  }

  // 4. CONFIRMAR ELIMINACIÓN (soft delete: PATCH activo = false)
  const handleConfirmarEliminar = async () => {
    if (!usuarioAEliminar) return
    const usuario = usuarioAEliminar

    try {
      const response = await fetch(`${API_URL}/${usuario.id_usuario}/activo`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ activo: false })
      })

      if (response.ok) {
        // Quitamos al usuario de la lista visible.
        // En la base de datos sigue existiendo, solo con activo = false.
        setUsuarios((prev) => prev.filter((u) => u.id_usuario !== usuario.id_usuario))
      } else {
        console.error("No se pudo eliminar el usuario")
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error)
    } finally {
      setUsuarioAEliminar(null)
    }
  }

  const handleCancelarEliminar = () => {
    setUsuarioAEliminar(null)
  }

  if (loading) return <div className="contenedor-usuarios"><p>Cargando panel de control...</p></div>

  return (
    <div className="contenedor-usuarios">
      <main className="contenido">
        <div className="header">
          <div>
            <h1>Gestión de Usuarios</h1>
            <p>Control de accesos y roles (Modo Administrador).</p>
          </div>
        </div>

        {/* 📊 SECCIÓN DE TARJETAS INTERACTIVAS */}
        <div className="tarjetas-estadisticas">
          <div 
            className={`tarjeta-kpi tarjeta-kpi-total ${filtroActivo === "Todos" ? "active" : ""}`}
            onClick={() => setFiltroActivo("Todos")}
          >
            <div className="tarjeta-kpi-icono"><Users size={20} /></div>
            <div className="tarjeta-kpi-info">
              <span className="tarjeta-kpi-label">Total Usuarios</span>
              <h2 className="tarjeta-kpi-valor">{estadisticas.total}</h2>
            </div>
          </div>

          <div 
            className={`tarjeta-kpi tarjeta-kpi-activos ${filtroActivo === "Activos" ? "active" : ""}`}
            onClick={() => setFiltroActivo("Activos")}
          >
            <div className="tarjeta-kpi-icono"><UserCheck size={20} /></div>
            <div className="tarjeta-kpi-info">
              <span className="tarjeta-kpi-label">Usuarios Activos</span>
              <h2 className="tarjeta-kpi-valor">{estadisticas.activos}</h2>
            </div>
          </div>

          <div 
            className={`tarjeta-kpi tarjeta-kpi-sancionados ${filtroActivo === "Sancionados" ? "active" : ""}`}
            onClick={() => setFiltroActivo("Sancionados")}
          >
            <div className="tarjeta-kpi-icono"><ShieldAlert size={20} /></div>
            <div className="tarjeta-kpi-info">
              <span className="tarjeta-kpi-label">Usuarios Sancionados</span>
              <h2 className="tarjeta-kpi-valor">{estadisticas.sancionados}</h2>
            </div>
          </div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por nombre, CI o correo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="chips">
            {chips.map((chip) => (
              <span key={chip} className={`chip ${filtroActivo === chip ? "active" : ""}`} onClick={() => setFiltroActivo(chip)}>
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Nombre y Apellido</th>
                <th>CI (Cédula)</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="sin-resultados">
                    No se encontraron usuarios en esta sección.
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((usuario) => {
                  const editando = editandoId === usuario.id_usuario
                  return (
                    <tr key={usuario.id_usuario}>
                      <td>{usuario.nombre_apellido}</td>
                      <td>{usuario.ci}</td>

                      {/* Teléfono Editable */}
                      <td>
                        {editando ? (
                          <input 
                            type="text" 
                            className="input-telefono-editable" 
                            value={cambiosPendientes.telefono || ""} 
                            onChange={(e) => setCambiosPendientes({...cambiosPendientes, telefono: e.target.value})}
                          />
                        ) : usuario.telefono}
                      </td>

                      <td>{usuario.correo}</td>
                      
                      {/* Rol */}
                      <td>
                        <select 
                          className="select-estado" 
                          value={editando ? cambiosPendientes.id_tipo_usuario : usuario.id_tipo_usuario} 
                          onChange={(e) => setCambiosPendientes({...cambiosPendientes, id_tipo_usuario: e.target.value})} 
                          disabled={!editando}
                        >
                          {tiposUsuario.map(tipo => (
                            <option key={tipo.id_tipo_usuario} value={tipo.id_tipo_usuario}>
                              {tipo.nombre_tipo}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="acciones">
                        {editando ? (
                          <>
                            <button className="admin-user-edit-btn btn-guardar" onClick={() => handleGuardar(usuario.id_usuario, usuario)}>Guardar</button>
                            <button className="admin-user-delete-btn btn-cancelar-edicion" onClick={() => setEditandoId(null)}>Cancelar</button>
                          </>
                        ) : (
                          <>
                            <button className="admin-user-edit-btn" onClick={() => handleEditarClick(usuario)}>Editar</button>
                            
                            {/* 🗑️ BOTÓN ELIMINAR (soft delete: activo = false) */}
                            <button 
                              className="admin-user-delete-btn"
                              onClick={() => handleAbrirConfirmacion(usuario)}
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* 🪟 MODAL DE CONFIRMACIÓN PARA ELIMINAR USUARIO */}
      {usuarioAEliminar && (
        <div className="modal-overlay" onClick={handleCancelarEliminar}>
          <div className="modal-eliminar" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-titulo">Eliminar usuario</h2>
            <p className="modal-texto">¿Estás seguro de que deseas eliminar este usuario?</p>

            <div className="modal-usuario-card">
              <div className="modal-usuario-nombre">{usuarioAEliminar.nombre_apellido}</div>
              <div className="modal-usuario-correo">{usuarioAEliminar.correo}</div>
            </div>

            <div className="modal-acciones">
              <button className="modal-btn-cancelar" onClick={handleCancelarEliminar}>
                Cancelar
              </button>
              <button className="modal-btn-aceptar" onClick={handleConfirmarEliminar}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}