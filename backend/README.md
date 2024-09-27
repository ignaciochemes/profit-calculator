<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Una aplicación de backend progresiva <a href="http://nodejs.org" target="_blank">Node.js</a> construida con Nest.js para la gestión de productos y cálculo de beneficios.</p>
    <p align="center">

## Descripción

Profit Calculator Backend es una aplicación robusta diseñada para gestionar productos, calcular beneficios y manejar autenticación de usuarios. Utiliza Nest.js como framework principal, TypeORM para la gestión de base de datos, y Docker para facilitar el despliegue y desarrollo.

## Características Principales

- Gestión de productos (CRUD)
- Cálculo de beneficios
- Autenticación de usuarios con JWT
- Migraciones de base de datos con TypeORM
- Dockerización para fácil despliegue

## Instalación

```bash
$ npm install
```

## Configuración de la Base de Datos

Este proyecto utiliza Docker Compose para configurar y ejecutar MariaDB. Para iniciar la base de datos:

```bash
$ docker-compose up -d
```

Este comando iniciará un contenedor de MariaDB en el puerto 3307.

## Migraciones

Para generar y ejecutar migraciones, utiliza los siguientes comandos:

```bash
# Crear una nueva migración
$ npm run migration:create -- nombre_de_la_migracion

# Ejecutar migraciones pendientes
$ npm run migration:run

# Revertir la última migración
$ npm run migration:revert

# Mostrar migraciones
$ npm run migration:show
```

## Ejecutando la aplicación

```bash
# desarrollo
$ npm run start

# modo watch
$ npm run start:dev

# modo producción
$ npm run start:prod

# modo local (con configuración específica)
$ npm run start:local
```

## Pruebas

```bash
# pruebas unitarias
$ npm run test

# pruebas e2e
$ npm run test:e2e

# cobertura de pruebas
$ npm run test:cov
```

## Uso de la Aplicación

1. Asegúrate de que la base de datos esté en funcionamiento (usando Docker Compose).
2. Ejecuta las migraciones para configurar la estructura de la base de datos.
3. Inicia la aplicación en el modo deseado (desarrollo, producción o local).

## Configuración de Entorno

Asegúrate de configurar las variables de entorno necesarias. Puedes crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
DB_HOST=localhost
DB_PORT=3307
DB_USERNAME=profit_calculator
DB_PASSWORD=profit_calculator
DB_DATABASE=profit_calculator
JWT_SECRET=tu_secreto_jwt
```

## Contribución

Las contribuciones son bienvenidas. Por favor, asegúrate de actualizar las pruebas según corresponda.

## Licencia

Nest is [MIT licensed](LICENSE).
