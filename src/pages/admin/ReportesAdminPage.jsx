import React, { useState, useEffect, useMemo } from "react"
import { Loader2 } from "lucide-react"
import { getReportesConfig, generarReporte } from "../../services/reports.services"
import { exportarReportePDF } from "../../utils/exportarReportePDF"
import SelectorEntidad from "../../components/reportes/SelectorEntidad"
import ConfiguracionReporte from "../../components/reportes/ConfiguracionReporte"
import ResultadoReporte from "../../components/reportes/ResultadoReporte"
import "./styles/ReportesAdminPage.css"

export default function ReportesAdminPage() {
  const [entidades, setEntidades] = useState([])
  const [cargandoConfig, setCargandoConfig] = useState(true)

  const [entidadKey, setEntidadKey] = useState(null)
  const [extensionesActivas, setExtensionesActivas] = useState([])
  const [columnasSeleccionadas, setColumnasSeleccionadas] = useState([])
  const [filtros, setFiltros] = useState({})
  // Objeto paralelo a `filtros`: guarda el usuario completo (nombre, correo) elegido
  // en un filtro tipo usuario_search, para poder mostrarlo aunque el buscador
  // se desmonte/remonte. `filtros[key]` sigue guardando solo el id_usuario (lo que espera el backend).
  const [usuariosInfo, setUsuariosInfo] = useState({})
  const [librosInfo, setLibrosInfo] = useState({})
  const [orden, setOrden] = useState({ columna: "", direccion: "ASC" })

  const [reporte, setReporte] = useState(null)
  const [generando, setGenerando] = useState(false)
  const [error, setError] = useState(null)
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    const cargarConfig = async () => {
      try {
        const data = await getReportesConfig()
        setEntidades(data)
      } catch (err) {
        console.error("Error al cargar configuración de reportes:", err)
        setError("No se pudo cargar la configuración de reportes.")
      } finally {
        setCargandoConfig(false)
      }
    }
    cargarConfig()
  }, [])

  const entidadActual = entidades.find(e => e.key === entidadKey)

  // Columnas/filtros disponibles = los base de la entidad + los de extensiones activas
  const columnasDisponibles = useMemo(() => {
    if (!entidadActual) return []
    let cols = [...entidadActual.columnas]
    for (const extKey of extensionesActivas) {
      const ext = entidadActual.extensiones.find(e => e.key === extKey)
      if (ext) cols = [...cols, ...ext.columnas]
    }
    return cols
  }, [entidadActual, extensionesActivas])

  const filtrosDisponibles = useMemo(() => {
    if (!entidadActual) return []
    let filtrosKeys = [...entidadActual.filtros]
    for (const extKey of extensionesActivas) {
      const ext = entidadActual.extensiones.find(e => e.key === extKey)
      if (ext) filtrosKeys = [...filtrosKeys, ...ext.filtros]
    }
    return filtrosKeys
  }, [entidadActual, extensionesActivas])

  // --- Navegación entre pantallas ---

  const handleElegirEntidad = (entidad) => {
    setEntidadKey(entidad.key)
    setExtensionesActivas([])
    setColumnasSeleccionadas(entidad.columnas.map(c => c.key))
    setFiltros({})
    setUsuariosInfo({})
    setLibrosInfo({})
    setOrden({ columna: "", direccion: "ASC" })
    setReporte(null)
    setError(null)
  }

  const handleCambiarTipo = () => {
    setEntidadKey(null)
    setExtensionesActivas([])
    setColumnasSeleccionadas([])
    setFiltros({})
    setUsuariosInfo({})
    setLibrosInfo({})
    setOrden({ columna: "", direccion: "ASC" })
    setReporte(null)
    setError(null)
    setResetKey(k => k + 1)
  }

  // Vuelve a la config del reporte actual (misma entidad) pero deja todo en blanco,
  // como si se acabara de elegir la entidad de nuevo.
  const handleLimpiarTodo = () => {
    if (!entidadActual) return
    setExtensionesActivas([])
    setColumnasSeleccionadas(entidadActual.columnas.map(c => c.key))
    setFiltros({})
    setUsuariosInfo({})
    setLibrosInfo({})
    setOrden({ columna: "", direccion: "ASC" })
    setReporte(null)
    setError(null)
    setResetKey(k => k + 1)
  }

  // Vuelve de la vista de resultado a la config, conservando filtros/columnas elegidos
  const handleEditarFiltros = () => setReporte(null)

  // --- Extensiones / columnas ---

  const toggleExtension = (ext) => {
    const activa = extensionesActivas.includes(ext.key)
    if (activa) {
      setExtensionesActivas(prev => prev.filter(e => e !== ext.key))
      const keysExt = ext.columnas.map(c => c.key)
      setColumnasSeleccionadas(prev => prev.filter(c => !keysExt.includes(c)))
      setFiltros(prev => {
        const nuevo = { ...prev }
        ext.filtros.forEach(f => delete nuevo[f])
        return nuevo
      })
      setUsuariosInfo(prev => {
        const nuevo = { ...prev }
        ext.filtros.forEach(f => delete nuevo[f])
        return nuevo
      })
      setLibrosInfo(prev => {
        const nuevo = { ...prev }
        ext.filtros.forEach(f => delete nuevo[f])
        return nuevo
      })
    } else {
      setExtensionesActivas(prev => [...prev, ext.key])
      setColumnasSeleccionadas(prev => [...prev, ...ext.columnas.map(c => c.key)])
    }
  }

  const toggleColumna = (key) => {
    setColumnasSeleccionadas(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    )
  }

  const handleSeleccionarTodas = () => setColumnasSeleccionadas(columnasDisponibles.map(c => c.key))
  const handleDeseleccionarTodas = () => setColumnasSeleccionadas([])

  // --- Filtros ---

  const handleFiltroChange = (key, value) => {
    setFiltros(prev => ({ ...prev, [key]: value }))
  }

  const handleSeleccionarUsuario = (filtroKey, usuario) => {
    setFiltros(prev => ({ ...prev, [filtroKey]: String(usuario.id_usuario) }))
    setUsuariosInfo(prev => ({ ...prev, [filtroKey]: usuario }))
  }

  const handleSeleccionarLibro = (filtroKey, libro) => {
    setFiltros(prev => ({ ...prev, [filtroKey]: String(libro.id_libro) }))
    setLibrosInfo(prev => ({ ...prev, [filtroKey]: libro }))
  }

  const handleQuitarUsuario = (filtroKey) => {
    setFiltros(prev => ({ ...prev, [filtroKey]: "" }))
    setUsuariosInfo(prev => {
      const nuevo = { ...prev }
      delete nuevo[filtroKey]
      return nuevo
    })
  }

  const handleQuitarLibro = (filtroKey) => {
    setFiltros(prev => ({ ...prev, [filtroKey]: "" }))
    setLibrosInfo(prev => {
      const nuevo = { ...prev }
      delete nuevo[filtroKey]
      return nuevo
    })
  }

  // --- Generación / exportación ---

  const handleGenerar = async () => {
    if (columnasSeleccionadas.length === 0) {
      setError("Seleccioná al menos una columna para el reporte.")
      return
    }
    setGenerando(true)
    setError(null)
    try {
      const resultado = await generarReporte(
        entidadKey,
        columnasSeleccionadas,
        filtros,
        extensionesActivas,
        orden.columna ? orden : null
      )
      setReporte(resultado)
    } catch (err) {
      console.error("Error al generar reporte:", err)
      setError(err.response?.data?.error || "Ocurrió un error al generar el reporte.")
    } finally {
      setGenerando(false)
    }
  }

  const handleImprimir = () => window.print()

  const handleExportarPDF = () => {
    if (!reporte) return
    exportarReportePDF(reporte, entidadActual.label, entidadKey)
  }

  // --- Render ---

  if (cargandoConfig) {
    return (
      <div className="contenedor-reportes">
        <p className="reportes-cargando"><Loader2 className="spin" size={18} /> Cargando módulo de reportes...</p>
      </div>
    )
  }

  return (
    <div className="contenedor-reportes">
      <main className="contenido">
        <div className="header">
          <div>
            <h1>Reportes</h1>
            <p>Generá listados personalizados del sistema para auditoría, impresión o exportación a PDF.</p>
          </div>
        </div>

        {error && <div className="reportes-error">{error}</div>}

        {!entidadKey && (
          <SelectorEntidad entidades={entidades} onElegir={handleElegirEntidad} />
        )}

        {entidadKey && !reporte && (
          <ConfiguracionReporte
            entidadActual={entidadActual}
            extensionesActivas={extensionesActivas}
            columnasDisponibles={columnasDisponibles}
            columnasSeleccionadas={columnasSeleccionadas}
            filtrosDisponibles={filtrosDisponibles}
            filtros={filtros}
            usuariosInfo={usuariosInfo}
            orden={orden}
            generando={generando}
            onToggleExtension={toggleExtension}
            onToggleColumna={toggleColumna}
            onSeleccionarTodas={handleSeleccionarTodas}
            onDeseleccionarTodas={handleDeseleccionarTodas}
            onFiltroChange={handleFiltroChange}
            onSeleccionarUsuario={handleSeleccionarUsuario}
            onQuitarUsuario={handleQuitarUsuario}
            onOrdenChange={setOrden}
            onGenerar={handleGenerar}
            onCambiarTipo={handleCambiarTipo}
            onLimpiarTodo={handleLimpiarTodo}
            librosInfo={librosInfo}
            onSeleccionarLibro={handleSeleccionarLibro}
            onQuitarLibro={handleQuitarLibro}
            resetKey={resetKey}
          />
        )}

        {reporte && (
          <ResultadoReporte
            reporte={reporte}
            entidadLabel={entidadActual.label}
            onEditarFiltros={handleEditarFiltros}
            onLimpiarTodo={handleLimpiarTodo}
            onImprimir={handleImprimir}
            onExportarPDF={handleExportarPDF}
          />
        )}
      </main>
    </div>
  )
}