# BibliotecaFCyT - Frontend

Frontend de la aplicación de gestión de biblioteca para la Facultad de Ciencias y Tecnología (FCyT). El sistema es una aplicación web de gestión de biblioteca para la Facultad de Ciencias y Tecnología (FCyT). Su objetivo principal es digitalizar y organizar todo el proceso relacionado con el manejo de libros, usuarios y servicios de préstamo dentro de la biblioteca, facilitando el trabajo tanto de los administradores como de los estudiantes o usuarios que la utilicen.

Autores : 
Jose Vega Santos
Carina Velazquez
Alejandro Villalba
## Tecnologías

- React
- Vite

## Instalación

```bash
npm install
```

## Uso

```bash
npm run dev
```

## 🎯 Características

- ✅ **Interfaz Moderna** - Diseño responsive con React y CSS personalizado
- ✅ **Autenticación Segura** - Login con credenciales y Google OAuth 2.0
- ✅ **Control de Acceso por Roles** - Vistas diferenciadas para admin, bibliotecario y usuario
- ✅ **Catálogo de Libros** - Exploración y búsqueda de libros disponibles
- ✅ **Gestión de Usuarios** - Visualización y control de usuarios
- ✅ **Gestión de Préstamos** - Visualización y control de préstamos activos
- ✅ **Sistema de Sanciones** - Consulta y gestión de sanciones
- ✅ **Sistema de Devoluciones** - Registro de devoluciones de libros
- ✅ **Notificaciones** - Sistema de alertas para los usuarios
- ✅ **Panel de Administración** - Gestión completa de usuarios, libros y préstamos
- ✅ **Rutas Protegidas** - Navegación segura con verificación de sesión
- ✅ **Carrito de Solicitudes** - Sistema de carrito para solicitudes de libros
- ✅ **Selección de Rol** - Flujo de selección de rol al iniciar sesión

---

---

## 🏗️ Estructura del Proyecto
´´´
fronted/

├── index.html # Punto de entrada HTML

├── package.json # Dependencias del proyecto

├── package-lock.json # Lock de dependencias

├── vite.config.js # Configuración de Vite

├── eslint.config.js # Configuración de ESLint

├── .env # Variables de entorno (no subir a git)

├── .env.example # Ejemplo de variables de entorno

├── .gitignore # Archivos ignorados por Git

├── README.md # Documentación del proyecto

│

├── public/

│ ├── favicon.svg # Favicon de la aplicación

│ └── icons.svg # Iconos SVG

│

└── src/

├── main.jsx # Punto de entrada de React

├── App.jsx # Componente raíz

├── App.css # Estilos de App

├── index.css # Estilos globales

│

├── assets/

│ ├── icons/

│ │ ├── logo-web-blanco.png

│ │ ├── LogoFCyT.png

│ │ ├── logofcytunca.png

│ │ ├── react.svg

│ │ └── vite.svg

│ └── images/

│ ├── biblioteca-fondo.jpg

│ ├── Calculo.jpg

│ ├── Electrica.jpg

│ ├── hero.png

│ └── Informatica.jpg

│

├── components/

│ ├── devoluciones/ # Componentes de devoluciones

│ ├── prestamos/ # Componentes de préstamos

│ ├── sanciones/ # Componentes de sanciones

│ ├── styles/ # Estilos de componentes

│ ├── Buscador.jsx

│ ├── CamposAutores.jsx

│ ├── CarritoItem.jsx

│ ├── CatalogoPagination.jsx

│ ├── EjemplarItem.jsx

│ ├── Filtros.jsx

│ ├── FooterLogin.jsx

│ ├── InputImagen.jsx

│ ├── LibroCard.jsx

│ ├── LibroInfoItem.jsx

│ ├── ListaLibros.jsx

│ ├── ModalExito.jsx

│ ├── NotificacionesBadge.jsx

│ ├── NuevoMaterialHelpers.jsx

│ ├── PrestamoCard.jsx

│ ├── PrestamoConfirmModal.jsx

│ ├── PrestamoDetalleModal.jsx

│ ├── PrestamoEstadoBadge.jsx

│ ├── PrestamoFilters.jsx

│ ├── PrestamoPagination.jsx

│ ├── PrestamoSolicitudCard.jsx

│ ├── PrestamoSolicitudModal.jsx

│ ├── PrestamoTabs.jsx

│ ├── SelectPersonalizado.jsx

│ ├── SolicitudFilters.jsx

│ └── SolicitudTipoBadge.jsx

│

├── context/

│ └── AuthContext.jsx # Contexto de autenticación (JWT, usuario)

│

├── hooks/ # Custom hooks

│

├── layouts/

│ ├── prueba/

│ │ ├── AdminLayout.jsx

│ │ ├── Layout.css

│ │ └── UserLayout.jsx

│ ├── styles/

│ │ ├── AdminLayout.css

│ │ ├── Footer.css

│ │ ├── Navbar.css

│ │ ├── SidebarAdmin.css

│ │ ├── SidebarUser.css

│ │ └── UserLayout.css

│ ├── AdminLayout.jsx

│ ├── BibliotecarioLayout.jsx

│ ├── Footer.jsx

│ ├── Navbar.jsx

│ ├── SidebarAdmin.jsx

│ ├── SidebarUser.jsx

│ └── UserLayout.jsx

│

├── layouts_components/

│ ├── Footer.jsx

│ ├── Navbar.jsx

│ ├── SidebarAdmin.jsx

│ └── SidebarUser.jsx

│

├── layouts_prueba/

│ ├── AdminLayout.jsx

│ ├── Layout.css

│ └── UserLayout.jsx

│

├── pages/

│ ├── admin/

│ │ ├── prueba/

│ │ │ ├── AdminDevolucionesPage.jsx

│ │ │ ├── AdminDevolucionesPage.css

│ │ │ ├── AdminPrestamosPage.jsx

│ │ │ ├── AdminSancionesPage.jsx

│ │ │ ├── AdminSancionesPage.css

│ │ │ ├── EditarLibroPage.jsx

│ │ │ ├── GestionPrestamosPage.jsx

│ │ │ ├── InformesPage.jsx

│ │ │ ├── NuevaSancionPage.jsx

│ │ │ ├── NuevaSancionPage.css

│ │ │ ├── NuevoLibroPage.jsx

│ │ │ └── UsuariosPage.jsx

│ │ ├── AdminCatalogoPage.jsx

│ │ ├── CatalogoAdmin.jsx

│ │ ├── DashboardAdmin.jsx

│ │ ├── DetalleLibroAdminPage.jsx

│ │ ├── GestionUsuarios.jsx

│ │ ├── LibroDetalleAdmin.jsx

│ │ ├── ModificarMaterial.jsx

│ │ ├── NuevoMaterial.jsx

│ │ ├── PerfilAdminPage.jsx

│ │ ├── PrestamosAdmin.jsx

│ │ └── PrestamosAdminPage.jsx

│ │

│ ├── auth/

│ │ ├── auth_styles/

│ │ ├── AuthCallbackPage.jsx

│ │ ├── CompletarPerfilPage.jsx

│ │ ├── CompletarPerfilPage.css

│ │ ├── LoginPage.jsx

│ │ ├── LoginPage.css

│ │ ├── RolSelectorPage.jsx

│ │ └── RolSelectorPage.css

│ │

│ ├── public/

│ │ ├── CatalogoPublic.jsx

│ │ ├── CatalogoPublicPage.jsx

│ │ ├── LibroDetallePublic.jsx

│ │ └── LibroDetallePublicPage.jsx

│ │

│ ├── styles/

│ │ ├── styles_admin/

│ │ │ ├── CatalogoAdmin.css

│ │ │ ├── DashboardAdmin.css

│ │ │ ├── GestionUsuarios.css

│ │ │ ├── LibroDetalleAdmin.css

│ │ │ ├── ModificarMaterial.css

│ │ │ ├── NuevoMaterial.css

│ │ │ └── PrestamosAdmin.css

│ │ ├── styles_user/

│ │ │ ├── Carrito.css

│ │ │ ├── Catalogo.css

│ │ │ ├── DashboardUser.css

│ │ │ ├── LibroDetalle.css

│ │ │ └── SancionesUserPage.css

│ │ ├── Dashboard.css

│ │ └── PerfilPage.css

│ │

│ └── user/

│ ├── prueba/

│ │ ├── DevolucionesUserPage.jsx

│ │ ├── DevolucionesUserPage.css

│ │ └── PrestamosPage.jsx

│ ├── Carrito.jsx

│ ├── Catalogo.jsx

│ ├── CatalogoUserPage.jsx

│ ├── DashboardUser.jsx

│ ├── DetalleLibroUserPage.jsx

│ ├── LibroDetalle.jsx

│ ├── PerfilUserPage.jsx

│ └── SancionesUserPage.jsx

│

├── routes/

│ ├── AppRouter.jsx # Definición de rutas principales

│ ├── ProtectedRoute.jsx # Wrapper de rutas protegidas

│ └── ScrollToTop.jsx # Scroll al inicio en cada navegación

│

└── services/

├── api.js # Configuración base de axios/fetch

├── auth.services.js # Servicios de autenticación

├── books.services.js # Servicios de libros

├── copies.services.js # Servicios de copias/ejemplares

├── loans.services.js # Servicios de préstamos

├── notifications.services.js # Servicios de notificaciones

├── returns.services.js # Servicios de devoluciones

├── sanctions.services.js # Servicios de sanciones

└── users.services.js # Servicios de usuarios
```

## 🌐 Conexión con el Backend

Este frontend consume la API REST documentada en el repositorio del backend (`BibliotecaFCyT-Proyect`), incluyendo los módulos de:

- Autenticación (`/api/auth`)
- Libros y copias (`/api/books`, `/api/books/:id/copies`)
- Préstamos y devoluciones (`/api/loans`)
- Sanciones (`/api/sanctions`)
- Usuarios (`/api/users`)
- Notificaciones (`/api/notifications`)
- Actividades y sesiones (`/api/activity`, `/api/sessions`)

---

**Última actualización:** 23 de Junio de 2026