# Presentación

REST API hecha para el challenge de Node de Alkemy, permite manipular información sobre películas, series y sus personajes.

## Antes de correr la app

Esta aplicación utiliza [SendGrid](https://sendgrid.com) para enviar correos electrónicos. Necesitará una cuenta, una clave API y
una dirección de correo electrónico verificada para poder enviar correos electrónicos.

También asegúrese de crear un archivo llamado `.env` en la raíz del proyecto. Puede pegar el contenido de
[.env.example](./.env.example) en `.env` y agregue los valores requeridos.

## Empezar la app

### Development

```bash
docker-compose up --build -d
```

### Debug

```
docker-compose -f docker-compose.yml -f docker-compose.debug.yml up --build -d
```

## Docs

Puede acceder a la página de la interfaz de usuario de Swagger en `/docs`.

## Migrations

Puede ejecutar las migraciones usando `docker-compose exec app yarn migrator run`.
También puede usar `docker-compose exec app yarn migrator -h` para obtener comandos más útiles.

Las seeders se ejecutan automáticamente cuando inicia la aplicación en modo de desarrollo o depuración.

## E2E Testing

Esta aplicación utiliza la API [sendmail.app](https://sendmail.app) para verificar si la bienvenida el correo electrónico se envió con éxito, por lo que para ejecutar las pruebas e2e, necesitará una cuenta en ese servicio, y proporcione una clave API y un espacio de nombres en el archivo .env.

Luego puede usar `docker-compose run --rm app yarn test:e2e` para ejecutar las pruebas de e2e.

### License

See [LICENSE](./LICENSE)
