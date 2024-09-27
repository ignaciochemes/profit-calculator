# Calculadora de Ganancias y Dashboard de Información

## Descripción del Proyecto

Este proyecto es una aplicación web desarrollada en React que incluye una calculadora de ganancias y un dashboard de información con visualizaciones gráficas. Está diseñada para ayudar a los usuarios a calcular ganancias de productos, gestionar inventarios y visualizar datos de ventas y ganancias.

## Características Principales

- Calculadora de ganancias con selección dinámica de productos
- Dashboard de información con gráficos interactivos
- Sistema de autenticación de usuarios
- Gestión de productos (agregar, editar, eliminar)
- Visualización de historial de cálculos de ganancias

## Tecnologías Utilizadas

- React
- React Bootstrap para el diseño UI
- Recharts para visualizaciones gráficas
- React Router para la navegación
- Fetch API para las peticiones al backend

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (versión 12.0 o superior)
- npm (normalmente viene con Node.js)

## Instalación

1. Clona el repositorio:
   ```
   git clone https://github.com/ignaciochemes/profit-calculator.git
   ```

2. Navega al directorio del proyecto:
   ```
   cd profit-calculator
   cd frontend
   cd backend
   ```

3. Instala las dependencias:
   ```
   npm install (frontend)
   npm install (backend)
   ```

## Configuración (frontend)

1. Crea un archivo `.env` en la raíz del proyecto y configura las variables de entorno necesarias:
   ```
   VITE_API_URL=http://localhost:33000/api/v1/carta-online
   ```

2. Ajusta la URL de la API en el archivo de configuración si es necesario.

## Uso (frontend)

Para iniciar la aplicación en modo de desarrollo:

```
npm run local (frontend)
```

La aplicación estará disponible en `http://localhost:5173`.

## Componentes Principales

- `ProfitCalculator`: Permite a los usuarios calcular ganancias basadas en productos seleccionados.
- `ProductList`: Muestra y permite gestionar la lista de productos.
- `Information`: Dashboard con gráficos que muestran diferentes métricas de ventas y ganancias.
- `LoginPage` y `RegisterPage`: Manejan la autenticación de usuarios.

## API y Backend

La aplicación se comunica con un backend a través de una API RESTful. Asegúrate de que el servidor backend esté en funcionamiento y accesible en la URL configurada.

## Configuración (backend)
Documentacion del backend en backend/readme.md

## Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir cambios mayores antes de hacer un pull request.

## Licencia

[MIT License](https://opensource.org/licenses/MIT)

## Contacto

[Ignacio Chemes] - [nachogonza123@gmail.com]

Enlace del proyecto: [https://github.com/ignaciochemes/profit-calculator](https://github.com/ignaciochemes/profit-calculator)