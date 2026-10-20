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
| `/registro` | Sin sesión. Crea cuenta y loguea |

* Sin sesión, cualquier ruta (incluso una inexistente) redirige al login. Después de iniciar sesión, se vuelve a la ruta anterior.
* Con sesión, una ruta inexistente muestra una página 404. Sin permisos, una página 403.
* Registro público en `/registro`: crea la cuenta con rol USER usando `POST /auth/register` y deja la sesión iniciada. Comparte el diseño del login (`AuthLayout`).

## Formularios y validaciones

* Los formularios usan **React Hook Form** con **Zod** (`src/schemas/`), y validan en tiempo real mientras el usuario escribe (zod).
* Las reglas de validación son las mismas de los schemas de backend, para que ambos acepten exactamente los mismos datos.
* Los campos reutilizables (`FormTextField`, `FormPasswordField`) conectan los componentes de MUI con el formulario y muestran los errores debajo de cada campo.

## Feedback al usuario

* **Notificaciones (toast):** componente propio (`ToastProvider` + hook `useToast`) para mensajes de éxito, error e información. Se acumulan máximo 3 y se cierran solas.
* **Confirmación:** `ConfirmDialog`, un modal de confirmación reutilizable al estilo Sweet Alert para acciones como eliminar un producto o inactivar un usuario.
* **Estados:** `StatusView` muestra imagenespor defecto para estados vacíos, la página 404 y el acceso no permitido. `FullScreenLoader` muestra el spinner mientras se carga.
* **Indicadores de carga:** en local la API responde tan rápido que los spinners casi no se ven. Para revisarlos, define `VITE_API_DELAY_MS=1500` en el `.env` y reinicia `npm run dev`. Probar recardando la página

## Layout

* Menú lateral con las secciones disponibles según el rol. Usuarios solo lo ve ADMIN.
* El menú se puede **fijar abierto** o dejar contraídocon solo los íconos. Contraído, se expande al pasar el mouse o al navegar con el teclado, sin mover el contenido. La preferencia se recuerda en el navegador.
* En celular, el menú se abre como panel desde el botón del header.
* El header muestra el usuario, su rol y la opción de cerrar sesión.

## Datos compartidos del dashboard

* Un proveedor (`ProductsDataProvider`) carga **una sola vez** todos los productos activos al entrar a la aplicación, recorriendo las páginas del listado en paralelo.
* Todas las métricas y gráficos del dashboard se calculan a partir de esa caché, sin hacer una petición por gráfico.
* Después de crear, editar o eliminar un producto, la caché se actualiza. Si la actualización falla, se conservan los datos anteriores.
* Las métricas se calculan en `src/services/metrics.service.ts` con `reduce`, `map`, `filter` y `sort`, como funciones puras y sin filtrado desde bd.
* El **valor total del inventario** es la suma de `precio × stock` de cada producto, calculada con `decimal.js` para evitar errores de precisión con los centavos.
* Los gráficos usan **Recharts**: una dona con la proporción de productos por categoría y barras con el top 5 de productos más caros. Los colores están validados para daltonismo
* La actividad reciente usa `DataTable`, la tabla genérica del proyecto: recibe columnas, acciones y paginación como props, y la reutilizan el dashboard, el inventario y la administración de usuarios. Siempre reserva el alto de 5 filas para que el diseño no salte.
* La dona muestra todas las categorías (tooltip con nombre, cantidad y porcentaje). La leyenda lista las 5 con más productos y agrupa el resto en "Otras", con un tooltip que muestra cuáles son.

### Inventario
* Paginación, búsqueda por título y rango de fechas se validan **en el servidor** (`offset`, `limit`, `search`, `from`, `to`); se pide solo la página visible.
* La búsqueda usa *debounce* (400 ms) para no hacer una petición por cada letra.
* Solo el rol ADMIN ve la columna de acciones. Al eliminar, se pide confirmación y se actualizan el listado y las métricas del dashboard.
* Al crear producto, la categoría se elige de las existentes (se listan a partir de los productos) o se escribe una nueva.
* Hasta 4 imágenes por producto se puede cargar. Cada URL tiene vista previa y, si no carga, se muestra una imagen por defecto. La primera siempre será la principal

### Administración de usuarios
* Solo permitido al ADMIN. Reutiliza `DataTable`, `FormDialog` y `ConfirmDialog`: tabla paginada con filtro Activos/Inactivos (parámetro `active` de la API).
* Se puede crear, editar (nombre, email, rol y contraseña opcional) e inactivar o reactivar sin eliminar.
* Un ADMIN no puede inactivarse ni cambiar su propio rol: los controles se deshabilitan y el backend también lo valida.