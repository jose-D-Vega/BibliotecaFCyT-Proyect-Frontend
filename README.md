# BibliotecaFCyT - Frontend

Frontend de la aplicación de gestión de biblioteca para la Facultad de Ciencias y Tecnología (FCyT). El sistema es una aplicación web de gestión de biblioteca para la Facultad de Ciencias y Tecnología (FCyT). Su objetivo principal es digitalizar y organizar todo el proceso relacionado con el manejo de libros, usuarios y servicios de préstamo dentro de la biblioteca, facilitando el trabajo tanto de los administradores como de los estudiantes o usuarios que la utilicen.

Autores : 
Jose Vega Santos
Carina Velazquez
Alejandro Villalba
## Tecnologías

- **React** 19
- **Vite** 8
- **React Router DOM** 7 - Enrutamiento
- **Axios** - Cliente HTTP para consumir la API
- **@react-oauth/google** - Login con Google OAuth 2.0
- **lucide-react** / **react-icons** - Íconos
- **jspdf** + **jspdf-autotable** - Exportación de reportes a PDF
- **ESLint** - Linting

## Instalación

```bash
npm install
```

## Uso

```bash
npm run dev
```

## Variables de Entorno

Copiar `.env.example` a `.env` y completar:
```env
VITE_API_URL=http://localhost:3210
```

## 🎯 Características

- ✅ **Interfaz Moderna** - Diseño responsive con React y CSS personalizado
- ✅ **Autenticación Segura** - Login con Google OAuth 2.0 y JWT
- ✅ **Control de Acceso por Roles** - Vistas y layouts diferenciados para admin, bibliotecario y usuario
- ✅ **Catálogo de Libros** - Exploración, búsqueda y detalle (vistas pública, usuario, bibliotecario y admin)
- ✅ **Gestión de Usuarios** - Visualización y control de usuarios (admin)
- ✅ **Gestión de Préstamos** - Solicitud, seguimiento, renovación y cancelación de préstamos
- ✅ **Sistema de Sanciones** - Consulta y gestión de sanciones por infracción de préstamo o comportamiento
- ✅ **Sistema de Devoluciones** - Registro y detalle de devoluciones de libros
- ✅ **Notificaciones** - Sistema de alertas en tiempo real para los usuarios (`NotificationsContext`)
- ✅ **Panel de Administración** - Gestión completa de usuarios, libros, préstamos, sanciones y sesiones
- ✅ **Reportes** - Generación y exportación a PDF de reportes (admin y bibliotecario)
- ✅ **Registro de Actividades** - Auditoría de operaciones del sistema (admin)
- ✅ **Control de Sesiones** - Visualización de sesiones activas/expiradas (admin)
- ✅ **Rutas Protegidas** - Navegación segura con verificación de sesión (`ProtectedRoute`)
- ✅ **Carrito de Solicitudes** - Sistema de carrito para solicitudes de préstamo (`CartContext`)
- ✅ **Selección de Rol** - Flujo de selección de rol activo al iniciar sesión (para usuarios con más de un rol)

---

```
frontend/
├── index.html                    # Punto de entrada HTML
├── package.json                  # Dependencias del proyecto
├── package-lock.json             # Lock de dependencias
├── vite.config.js                # Configuración de Vite
├── eslint.config.js              # Configuración de ESLint
├── .env                          # Variables de entorno (no subir a git)
├── .env.example                  # Ejemplo de variables de entorno
├── .gitignore                    # Archivos ignorados por Git
├── README.md                     # Documentación del proyecto
│
├── public/
│   ├── favicon.svg               # Favicon de la aplicación
│   └── icons.svg                 # Sprite de íconos SVG
│
└── src/
    ├── main.jsx                  # Punto de entrada de React (providers + AppRouter)
    ├── index.css                 # Estilos globales
    │
    ├── assets/
    │   ├── icons/                # Logos (FCyT, web, etc.)
    │   └── images/                # Imágenes de fondo/hero/carreras
    │
    ├── components/                # Componentes reutilizables, agrupados por dominio
    │   ├── catalogo/              # Cards, filtros, buscador, detalle de libro (público/user/admin/biblio)
    │   ├── devoluciones/          # Tabs, modales y cards de devoluciones
    │   ├── login/                 # FooterLogin
    │   ├── notificaciones/        # Badge y filtros de notificaciones
    │   ├── prestamos/             # Cards e historial de préstamos (vista usuario)
    │   ├── prestamos-admin/       # Cards, modales, filtros y tabs de préstamos (vista admin/bibliotecario)
    │   ├── reportes/              # Selectores, filtros y resultado de reportes
    │   ├── sanciones/             # Cards, modales y listado de sanciones
    │   └── sesiones/              # Tabla, filtros y paginación de sesiones
    │
    ├── constants/
    │   └── filtrosMeta.js         # Metadatos de filtros reutilizables
    │
    ├── context/                   # Contextos globales de React
    │   ├── AuthContext.jsx        # Autenticación (JWT, usuario, rol activo)
    │   ├── CartContext.jsx        # Carrito de solicitudes de préstamo
    │   └── NotificationsContext.jsx # Notificaciones en tiempo real
    │
    ├── hooks/                     # Custom hooks
    │
    ├── layouts/
    │   ├── AdminLayout.jsx
    │   ├── BibliotecarioLayout.jsx
    │   ├── UserLayout.jsx
    │   ├── components/
    │   │   ├── Footer.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── SidebarAdmin.jsx
    │   │   ├── SidebarBibliotecario.jsx
    │   │   ├── SidebarUser.jsx
    │   │   └── styles/
    │   └── styles/
    │       ├── AdminLayout.css
    │       └── UserLayout.css
    │
    ├── pages/
    │   ├── NotificacionesPage.jsx
    │   ├── styles/                # Estilos compartidos (Dashboard, Perfil, Notificaciones)
    │   ├── admin/                 # Páginas del panel de administración
    │   │   ├── DashboardAdmin.jsx
    │   │   ├── CatalogoAdminPage.jsx
    │   │   ├── LibroDetalleAdminPage.jsx
    │   │   ├── NuevoMaterial.jsx / ModificarMaterial.jsx
    │   │   ├── PrestamosAdminPage.jsx / PrestamosAdmin.jsx
    │   │   ├── DevolucionesAdminPage.jsx
    │   │   ├── SancionesAdminPage.jsx / NuevaSancionPage.jsx
    │   │   ├── DetalleSancionesPrestamoPage.jsx / DetalleSancionesComportamientoPage.jsx
    │   │   ├── ReportesAdminPage.jsx
    │   │   ├── ActividadesAdminPage.jsx
    │   │   ├── GestionUsuarios.jsx
    │   │   ├── SesionesAdmin.jsx
    │   │   ├── PerfilAdminPage.jsx
    │   │   └── styles/
    │   ├── auth/                  # Login, callback de OAuth, selección de rol, completar perfil
    │   │   ├── LoginPage.jsx
    │   │   ├── AuthCallbackPage.jsx
    │   │   ├── RolSelectorPage.jsx
    │   │   ├── CompletarPerfilPage.jsx
    │   │   └── styles/
    │   ├── bibliotecario/         # Páginas del panel de bibliotecario
    │   │   ├── DashboardBiblio.jsx
    │   │   ├── LibroDetalleBibliotecarioPage.jsx
    │   │   ├── ReportesBibliotecarioPage.jsx
    │   │   ├── PerfilBibliotecarioPage.jsx
    │   │   └── styles/
    │   ├── public/                # Catálogo público sin autenticación
    │   │   ├── CatalogoPublicPage.jsx
    │   │   ├── LibroDetallePublicPage.jsx
    │   │   └── styles/
    │   └── user/                  # Páginas del usuario normal
    │       ├── DashboardUser.jsx
    │       ├── CatalogoUserPage.jsx
    │       ├── LibroDetalleUserPage.jsx
    │       ├── MisSolicitudesPage.jsx
    │       ├── PrestamosUserPage.jsx
    │       ├── DevolucionesUserPage.jsx
    │       ├── SancionesUserPage.jsx
    │       ├── PerfilUserPage.jsx
    │       └── styles/
    │
    ├── routes/
    │   ├── AppRouter.jsx           # Definición de rutas (públicas, por rol y layouts)
    │   ├── ProtectedRoute.jsx      # Wrapper de rutas protegidas por auth/rol
    │   └── ScrollToTop.jsx         # Scroll al inicio en cada navegación
    │
    ├── services/                   # Llamadas a la API (uno por dominio, sobre axios)
    │   ├── api.js                  # Instancia de axios (baseURL, interceptor de token)
    │   ├── auth.services.js
    │   ├── activity.services.js
    │   ├── books.services.js
    │   ├── copies.services.js
    │   ├── loans.services.js
    │   ├── notifications.services.js
    │   ├── reports.services.js
    │   ├── returns.services.js
    │   ├── sanctions.services.js
    │   ├── session.services.js
    │   └── users.services.js
    │
    └── utils/
        ├── bloquearCaracteresNumero.js
        ├── exportarReportePDF.js
        ├── formatearCelda.js
        ├── notificacionTipos.js
        ├── textFormatters.js
        └── validarRangoFecha.js
```

---

## 🧭 Roles y Rutas

La aplicación define layouts y sets de rutas separados por rol, protegidos con `ProtectedRoute` según el `rolActivo` del usuario autenticado (`AuthContext`):

- **Público** (sin login): catálogo y detalle de libro (`pages/public`)
- **Usuario normal** (`UserLayout`): dashboard, catálogo, mis solicitudes, préstamos, devoluciones, sanciones, perfil
- **Bibliotecario** (`BibliotecarioLayout`): dashboard, catálogo/detalle de libro, reportes, perfil
- **Admin** (`AdminLayout`): dashboard, catálogo y CRUD de materiales, préstamos, devoluciones, sanciones, reportes, actividades, gestión de usuarios, sesiones, perfil

Un usuario puede tener más de un rol asignado; en ese caso, `RolSelectorPage` le permite elegir con cuál rol operar en la sesión actual.

## 🌐 Conexión con el Backend

Este frontend consume la API REST documentada en el repositorio del backend (`BibliotecaFCyT-Proyect`), incluyendo los módulos de:

- Autenticación (`/api/auth`)
- Libros y copias (`/api/books`, `/api/books/:id/copies`)
- Préstamos y devoluciones (`/api/loans`, `/api/returns`)
- Sanciones (`/api/sanctions`)
- Usuarios (`/api/users`)
- Notificaciones (`/api/notifications`)
- Actividades y sesiones (`/api/activity`, `/api/sessions`)
- Dashboards (`/api/dashboard`, `/api/admin-dashboard`, `/api/bibliotecario-dashboard`)
- Reportes (`/api/reports`)

La URL base se toma de la variable `VITE_API_URL` y se centraliza en `src/services/api.js`.

---

**Última actualización:** 21 de Julio de 2026