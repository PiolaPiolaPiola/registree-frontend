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
