import React, { useState, useMemo, useEffect } from "react"
import "../styles/styles_admin/GestionUsuarios.css" 

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [tiposUsuario, setTiposUsuario] = useState([]) 
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [filtroActivo, setFiltroActivo] = useState("Todos")
  
  // Control de edición inline
  const [editandoId, setEditandoId] = useState(null)
  const [cambiosPendientes, setCambiosPendientes] = useState({})

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
        setUsuarios(Array.isArray(jsonUsers.data) ? jsonUsers.data : [])

        setLoading(false)
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
      activos: usuarios.filter(u => u.activo === true || u.activo === 'true').length,
      sancionados: usuarios.filter(u => u.sancionado === true || u.sancionado === 'true').length
    }
  }, [usuarios])

  // FILTRADO DINÁMICO (Incluye la selección de las tarjetas)
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
      lista = lista.filter((u) => u.sancionado === true || u.sancionado === 'true')
    }

    if (busqueda.trim() !== "") {
      const q = busqueda.toLowerCase()
      lista = lista.filter((u) =>
        u.nombre_apellido.toLowerCase().includes(q) || 
        (u.ci && u.ci.includes(q)) || 
        u.correo.toLowerCase().includes(q)
      )
    }
    return lista
  }, [usuarios, filtroActivo, busqueda])

  const handleEditarClick = (usuario) => {
    setEditandoId(usuario.id_usuario)
    setCambiosPendientes({
      id_tipo_usuario: usuario.id_tipo_usuario,
      activo: usuario.activo,
      telefono: usuario.telefono // <-- Cargamos el teléfono en lugar del CI
    })
  }

  // 2. GUARDAR ACTUALIZACIONES
  const handleGuardar = async (id_usuario, usuarioOriginal) => {
    try {
      // ¿Cambió el Rol?
      if (cambiosPendientes.id_tipo_usuario !== usuarioOriginal.id_tipo_usuario) {
        await fetch(`${API_URL}/${id_usuario}/rol`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ id_tipo_usuario: parseInt(cambiosPendientes.id_tipo_usuario) })
        })
      }

      // ¿Cambió el Estado Activo?
      if (cambiosPendientes.activo !== usuarioOriginal.activo) {
        await fetch(`${API_URL}/${id_usuario}/activo`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ activo: cambiosPendientes.activo })
        })
      }

      // ¿Cambió el Teléfono? -> Usamos tu endpoint para modificar datos de perfil (updateUser)
      if (cambiosPendientes.telefono !== usuarioOriginal.telefono) {
        await fetch(`${API_URL}/me`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ telefono: cambiosPendientes.telefono })
        })
      }

      const rolSeleccionado = tiposUsuario.find(t => t.id_tipo_usuario === parseInt(cambiosPendientes.id_tipo_usuario))
      setUsuarios((prev) =>
        prev.map((u) => (u.id_usuario === id_usuario ? { 
          ...u, 
          id_tipo_usuario: cambiosPendientes.id_tipo_usuario,
          rol: rolSeleccionado ? rolSeleccionado.nombre_tipo : u.rol,
          activo: cambiosPendientes.activo,
          telefono: cambiosPendientes.telefono // <-- Guardamos el teléfono editado localmente
        } : u))
      )
      setEditandoId(null)
    } catch (error) {
      console.error("Error al procesar las actualizaciones:", error)
    }
  }

  // 3. BORRADO LÓGICO
  const handleEliminar = async (id_usuario) => {
    if (window.confirm("¿Está seguro que desea desactivar esta cuenta de usuario?")) {
      try {
        const response = await fetch(`${API_URL}/${id_usuario}`, {
          method: "DELETE",
          headers
        })
        if (response.ok) {
          setUsuarios((prev) => 
            prev.map((u) => u.id_usuario === id_usuario ? { ...u, activo: false } : u)
          )
        }
      } catch (error) {
        console.error("Error al eliminar:", error)
      }
    }
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
        <div className="tarjetas-estadisticas" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '25px' }}>
          
          <div 
            className="tarjeta-kpi" 
            onClick={() => setFiltroActivo("Todos")}
            style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: filtroActivo === "Todos" ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', textTransform: 'uppercase', fontWeight: '600' }}>Total Usuarios</span>
            <h2 style={{ fontSize: '28px', margin: '5px 0 0 0', color: '#fff' }}>{estadisticas.total}</h2>
          </div>

          <div 
            className="tarjeta-kpi" 
            onClick={() => setFiltroActivo("Activos")}
            style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: filtroActivo === "Activos" ? '2px solid #4ade80' : '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <span style={{ color: '#4ade80', fontSize: '14px', textTransform: 'uppercase', fontWeight: '600' }}>Usuarios Activos</span>
            <h2 style={{ fontSize: '28px', margin: '5px 0 0 0', color: '#4ade80' }}>{estadisticas.activos}</h2>
          </div>

          <div 
            className="tarjeta-kpi" 
            onClick={() => setFiltroActivo("Sancionados")}
            style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: filtroActivo === "Sancionados" ? '2px solid #f87171' : '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <span style={{ color: '#f87171', fontSize: '14px', textTransform: 'uppercase', fontWeight: '600' }}>Usuarios Sancionados</span>
            <h2 style={{ fontSize: '28px', margin: '5px 0 0 0', color: '#f87171' }}>{estadisticas.sancionados}</h2>
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
                <th>Estado de Cuenta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'rgba(255,255,255,0.3)' }}>
                    No se encontraron usuarios en esta sección.
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((usuario) => {
                  const editando = editandoId === usuario.id_usuario
                  return (
                    <tr key={usuario.id_usuario}>
                      <td>{usuario.nombre_apellido}</td>
                      
                      {/* CI Bloqueado / No editable */}
                      <td>{usuario.ci}</td>

                      {/* Teléfono Editable 📞 */}
                      <td>
                        {editando ? (
                          <input 
                            type="text" 
                            className="search-box input" 
                            style={{padding: '4px 8px', width: '120px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px'}}
                            value={cambiosPendientes.telefono || ""} 
                            onChange={(e) => setCambiosPendientes({...cambiosPendientes, telefono: e.target.value})}
                          />
                        ) : usuario.telefono}
                      </td>

                      <td>{usuario.correo}</td>
                      
                      {/* Cambiar Rol */}
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

                      {/* Activar/Desactivar */}
                      <td>
                        <select 
                          className="select-estado" 
                          value={editando ? cambiosPendientes.activo : usuario.activo} 
                          onChange={(e) => setCambiosPendientes({...cambiosPendientes, activo: e.target.value === "true" || e.target.value === true})} 
                          disabled={!editando}
                        >
                          <option value={true}>Activo</option>
                          <option value={false}>Inactivo</option>
                        </select>
                      </td>

                      <td className="acciones">
                        {editando ? (
                          <>
                            <button className="admin-user-edit-btn" style={{background: 'rgba(34,197,94,0.15)', color: '#4ade80', borderColor: 'rgba(34,197,94,0.3)'}} onClick={() => handleGuardar(usuario.id_usuario, usuario)}>Guardar</button>
                            <button className="admin-user-delete-btn" style={{background: 'rgba(255,255,255,0.06)', color: '#fff', borderColor: 'rgba(255,255,255,0.1)'}} onClick={() => setEditandoId(null)}>Cancelar</button>
                          </>
                        ) : (
                          <>
                            <button className="admin-user-edit-btn" onClick={() => handleEditarClick(usuario)}>Editar</button>
                            <button className="admin-user-delete-btn" disabled={!usuario.activo} onClick={() => handleEliminar(usuario.id_usuario)}>Desactivar</button>
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
    </div>
  )
}