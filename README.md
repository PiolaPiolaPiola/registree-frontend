# registree-frontend

Aplicación web de **Registree**: dashboard gerencial de inventario, desarrollada con **React**, **TypeScript** y **Material UI**. Consume la API REST de [registree-backend](https://github.com/PiolaPiolaPiola/registree-backend).

---

## Requisitos previos

* Node.js v24 LTS
* API de [registree-backend](https://github.com/PiolaPiolaPiola/registree-backend) corriendo (por defecto en `http://localhost:3000/api`)

---

## Variables de entorno

| Variable | Descripción | Valor de ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API del backend | `http://localhost:3000/api` |
| `VITE_API_DELAY_MS` | Opcional, solo en desarrollo. Retrasa las peticiones (en ms) para ver los indicadores de carga | `1500` |

---

## Instalación y ejecución

* Clonar el repo:
```bash
git clone https://github.com/PiolaPiolaPiola/registree-frontend.git
```
* Instalar dependencias:
```bash
npm install
```
* Configurar variables de entorno:
```bash
cp .env.example .env
```
* Ejecutar en modo desarrollo (con el backend corriendo):
```bash
npm run dev
```
La aplicación queda disponible en `http://localhost:5173`. 

* Compilar y previsualizar la versión de producción:
```bash
npm run build
npm run preview
```
---

## Stack tecnológico

* **Core:** React 19 + TypeScript (Vite)
* **UI:** Material UI
* **Gráficos:** Recharts
* **HTTP:** Axios
* **Rutas:** React Router DOM
* **Formularios y validación:** React Hook Form + Zod
* **Fechas:** Dayjs
* **Precisión decimal:** Decimal.js

---

## Arquitectura modular por capas

Organizada con la misma orientación por capas que el backend:

```text
src/
├── config/       # Variables de entorno
├── models/       # Tipos de datos (similar a los modelos del backend)
├── schemas/      # Validaciones con Zod (mismas reglas que el backend)
├── api/          # Cliente Axios centralizado y peticiones por recurso
├── services/     # Lógica de negocio pura (métricas, formatos)
├── context/      # Estado global: sesión, notificaciones, datos compartidos
├── hooks/        # Hooks personalizados
├── components/   # Componentes reutilizables
├── views/        # Pantallas de la aplicación
├── routes/       # Rutas y protección por sesión y rol
├── styles/       # Tema de MUI y variables CSS
├── assets/       # Imágenes e ilustraciones SVG
└── utils/        # Utilidades compartidas
```

---

## Diseño UI

* Se exploraron propuestas de interfaz con Figma y Lovable, y finalmente se eligió un diseño base generado con Claude, que se ajustaba mejor a los requisitos y permitía utilizar MUI.
* **Colores:** inspirados en la paleta de tree-a Enterprises S.A.S.
* **Inspiración:** Sortly para el diseño de la tabla de inventario y Zoho para los paneles del dashboard.

## Estilos

* El tema de MUI (`src/styles/theme.ts`) define la paleta, la tipografía (Nunito) y los estilos base de los componentes. Con `cssVariables` estos se usan como variables CSS (`--mui-palette-primary-main`, `--mui-font-h1`.).
* Los tokens propios de la aplicación (radios, bordes, sombras y anchos del menú lateral) están en `src/styles/tokens.css` con el prefijo `--rg-`.

## Consumo de la API

* Todas las peticiones pasan por una instancia única de Axios (`src/api/http-client.ts`), que toma la URL de `VITE_API_URL`, agrega el token de sesión y estandariza los errores.
* Hay un archivo por recurso (`auth.api.ts`, `products.api.ts`, `users.api.ts`) con funciones tipadas que devuelven directamente los datos.
* Si el backend responde `401` (token inválido o expirado), la sesión se cierra y se redirige al login.
* Si la API no está disponible, se muestra un mensaje y no se rompe la app

## Sesión

* La sesión se maneja con un Context de React (`AuthProvider`) que guarda el usuario autenticado y su rol durante toda la aplicación. Se accede con el hook `useAuth`.
* El token se guarda en `localStorage` para mantener la sesión al recargar la página. Al abrir la app, el token se valida con `GET /auth/me`, que devuelve los datos actualizados del usuario.
* Si el token expira o el usuario es inactivado, la siguiente petición responde `401` y la sesión se cierra automáticamente.

## Rutas

| Ruta | Acceso |
|---|---|
| `/login` | Solo sin sesión (con sesión redirige al dashboard) |
| `/` | Dashboard. Requiere sesión |
| `/inventario` | Requiere sesión |
| `/usuarios` | Requiere sesión y rol `ADMIN` |

* Sin sesión, cualquier ruta (incluso una inexistente) redirige al login. Después de iniciar sesión, se vuelve a la ruta anterior.
* Con sesión, una ruta inexistente muestra una página 404. Sin permisos, una página 403.

## Formularios y validaciones

* Los formularios usan **React Hook Form** con **Zod** (`src/schemas/`), y validan en tiempo real mientras el usuario escribe (zod).
* Las reglas de validación son las mismas de los schemas de backend, para que ambos acepten exactamente los mismos datos.
* Los campos reutilizables (`FormTextField`, `FormPasswordField`) conectan los componentes de MUI con el formulario y muestran los errores debajo de cada campo.

## Feedback al usuario

* **Notificaciones (toast):** componente propio (`ToastProvider` + hook `useToast`) para mensajes de éxito, error e información. Se acumulan máximo 3 y se cierran solas.
* **Confirmación:** `ConfirmDialog`, un modal de confirmación reutilizable al estilo Sweet Alert para acciones como eliminar un producto o inactivar un usuario.
* **Estados:** `StatusView` muestra imagenespor defecto para estados vacíos, la página 404 y el acceso no permitido. `FullScreenLoader` muestra el spinner mientras se carga.
* **Indicadores de carga:** en local la API responde tan rápido que los spinners casi no se ven. Para revisarlos, define `VITE_API_DELAY_MS=1500` en el `.env` y reinicia `npm run dev`. Probar recardando la página