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
```
src/
│
├── components/
│   ├── ui/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Table/
│   │   ├── Modal/
│   │   └── Navbar/
│   │
│   ├── layout/
│   │   ├── Sidebar/
│   │   ├── Header/
│   │   └── Footer/
│   │
│   ├── forms/
│   │   ├── UserForm/
│   │   ├── RoleForm/
│   │   ├── BookForm/
│   │   ├── LoanForm/
│   │   └── ReturnForm/
│   │
│   ├── tables/
│   │   ├── UserTable/
│   │   ├── RoleTable/
│   │   ├── BookTable/
│   │   ├── LoanTable/
│   │   └── FineTable/
│   │
│   ├── shared/
│   │   ├── Loader/
│   │   ├── Alert/
│   │   └── ConfirmDialog/
│
├── pages/
│   ├── Dashboard/
│   ├── Usuarios/
│   ├── Roles/
│   ├── Libros/
│   ├── Ejemplares/
│   ├── Prestamos/
│   ├── Devoluciones/
│   └── Sanciones/
│
├── services/
│   ├── api/
│   │
│   └── http/
│       └── axiosClient.js
│
├── context/
│   ├── AuthContext.jsx
│   └── AppContext.jsx
│
├── hooks/
│   ├── useAuth.js
│   ├── useFetch.js
│   └── useTable.js
│
├── utils/
│   ├── validators.js
│   ├── formatters.js
│   └── constants.js
│
├── routes/
│   └── AppRouter.jsx
│
├── assets/
│   ├── images/
│   └── icons/
│
└── App.jsx
```