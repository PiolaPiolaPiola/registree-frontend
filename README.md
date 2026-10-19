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