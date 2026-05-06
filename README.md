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

## Estructura

```
src/
├── assets/
│   ├── icons/
│   │   ├── logo-web-blanco.png
│   │   ├── LogoFCyT.png
│   │   ├── logofcytunca.png
│   │   ├── react.svg
│   │   └── vite.svg
│   └── images/
│       ├── biblioteca-fondo.jpg
│       ├── Calculo.jpg
│       ├── Electrica.jpg
│       ├── hero.png
│       └── Informatica.jpg
├── components/
│   ├── styles/
│   │   ├── Buscador.css
│   │   ├── CarritoItem.css
│   │   ├── EjemplarItem.css
│   │   ├── Filtros.css
│   │   ├── LibroCard.css
│   │   ├── LibroInfoItem.css
│   │   └── ListaLibros.css
│   ├── .gitkeep
│   ├── Buscador.jsx
│   ├── CarritoItem.jsx
│   ├── EjemplarItem.jsx
│   ├── Filtros.jsx
│   ├── FooterLogin.jsx
│   ├── LibroCard.jsx
│   ├── LibroInfoItem.jsx
│   └── ListaLibros.jsx
├── context/
│   ├── .gitkeep
│   └── AuthContext.jsx
├── hooks/
│   └── .gitkeep
├── layouts/
│   ├── prueba/
│   │   ├── AdminLayout.jsx
│   │   ├── Layout.css
│   │   └── UserLayout.jsx
│   ├── styles/
│   │   ├── AdminLayout.css
│   │   ├── Footer.css
│   │   ├── Navbar.css
│   │   ├── SidebarAdmin.css
│   │   ├── SidebarUser.css
│   │   └── UserLayout.css
│   ├── AdminLayout.jsx
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   ├── SidebarAdmin.jsx
│   ├── SidebarUser.jsx
│   └── UserLayout.jsx
├── pages/
│   ├── admin/
│   │   ├── prueba/
│   │   │   ├── AdminCatalogoPage.jsx
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── AdminDevolucionesPage.jsx
│   │   │   ├── AdminPrestamosPage.jsx
│   │   │   ├── AdminSancionesPage.jsx
│   │   │   ├── InformesPage.jsx
│   │   │   └── UsuariosPage.jsx
│   │   ├── .gitkeep
│   │   ├── CatalogoAdmin.jsx
│   │   ├── DashboardAdmin.jsx
│   │   └── LibroDetalleAdmin.jsx
│   ├── auth/
│   │   ├── AuthCallbackPage.jsx
│   │   ├── CompletarPerfilPage.css
│   │   ├── CompletarPerfilPage.jsx
│   │   ├── LoginPage.css
│   │   ├── LoginPage.jsx
│   │   ├── RolSelectorPage.css
│   │   └── RolSelectorPage.jsx
│   ├── public/
│   │   ├── .gitkeep
│   │   ├── CatalogoPage.jsx
│   │   ├── CatalogoPublic.jsx
│   │   ├── DashboardPublic.jsx
│   │   └── LibroDetallePublic.jsx
│   ├── styles/
│   │   ├── Carrito.css
│   │   ├── Catalogo.css
│   │   ├── CatalogoAdmin.css
│   │   ├── DashboardAdmin.css
│   │   ├── DashboardPublic.css
│   │   ├── DashboardUser.css
│   │   ├── LibroDetalle.css
│   │   └── LibroDetalleAdmin.css
│   └── user/
│       ├── prueba/
│       │   ├── CarritoPage.jsx
│       │   ├── CatalogoUserPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── DetalleLibroUserPage.jsx
│       │   ├── DevolucionesPage.jsx
│       │   ├── PrestamosPage.jsx
│       │   └── SancionesPage.jsx
│       ├── .gitkeep
│       ├── Carrito.jsx
│       ├── Catalogo.jsx
│       ├── DashboardUser.jsx
│       └── LibroDetalle.jsx
├── routes/
│   ├── .gitkeep
│   ├── AppRouter.jsx
│   └── ProtectedRoute.jsx
├── services/
│   ├── .gitkeep
│   ├── api.js
│   ├── auth.services.js
│   └── users.services.js
├── App.css
├── App.jsx
├── index.css
└── main.jsx
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```