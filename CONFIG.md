# Configuration Guide

Este proyecto usa variables de entorno para configurar tanto el backend como el frontend.

## Backend Configuration

El backend lee las variables de entorno desde el archivo `.env` en la carpeta `server/`:

### Variables Disponibles

| Variable | Descripción | Valor por Defecto | Ejemplo |
|----------|-------------|-------------------|---------|
| `SERVER_PORT` | Puerto del servidor | `8002` | `8002` |
| `SERVER_HOST` | Host del servidor | `0.0.0.0` | `0.0.0.0` |
| `DATABASE_PATH` | Ruta a la base de datos SQLite | `./app/ipa_en.sqlite` | `./app/ipa_en.sqlite` |
| `CORS_ORIGINS` | Orígenes permitidos para CORS (separados por comas) | `http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000` | `http://localhost:5173,http://production-domain.com` |
| `API_TITLE` | Título de la API | `IPA Transcription API` | `My IPA API` |
| `API_DESCRIPTION` | Descripción de la API | `API for English IPA transcriptions...` | `Custom API description` |
| `API_VERSION` | Versión de la API | `1.0.0` | `2.1.0` |
| `ENVIRONMENT` | Modo de ejecución | `development` | `production` |

### Configuración de CORS

- En modo `development`: Se permite cualquier origen (`*`)
- En modo `production`: Solo se permiten los orígenes especificados en `CORS_ORIGINS`

### Archivos de Configuración

1. **`.env`**: Archivo de configuración actual (no incluido en git)
2. **`.env.example`**: Plantilla con todas las variables disponibles

## Frontend Configuration

El frontend usa variables de entorno de Vite (prefijadas con `VITE_`):

### Variables Disponibles

| Variable | Descripción | Valor por Defecto | Ejemplo |
|----------|-------------|-------------------|---------|
| `VITE_API_BASE_URL` | URL base de la API | `http://127.0.0.1:8002` | `http://localhost:8002` |
| `VITE_APP_TITLE` | Título de la aplicación | `IPA Transcription App` | `My IPA App` |
| `VITE_APP_DESCRIPTION` | Descripción de la aplicación | `English IPA Transcription...` | `Custom description` |
| `VITE_ENVIRONMENT` | Modo de ejecución | `development` | `production` |

### Archivos de Configuración

1. **`.env`**: Archivo de configuración actual (no incluido en git)
2. **`.env.example`**: Plantilla con todas las variables disponibles

## Configuración para Desarrollo

### Backend

```bash
cd server
cp .env.example .env
# Edita .env con tus valores
python app/main.py
```

### Frontend

```bash
cp .env.example .env
# Edita .env con tus valores
npm run dev
```

## Configuración para Producción

### Backend

1. Crea un archivo `.env` con las variables de producción:
   ```
   ENVIRONMENT=production
   SERVER_PORT=8002
   CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   DATABASE_PATH=/path/to/production/database.db
   ```

2. Ejecuta el servidor:
   ```bash
   python app/main.py
   ```

### Frontend

1. Crea un archivo `.env` para producción:
   ```
   VITE_API_BASE_URL=https://api.yourdomain.com
   VITE_ENVIRONMENT=production
   ```

2. Construye la aplicación:
   ```bash
   npm run build
   ```

## Notas Importantes

- **Seguridad**: Nunca commitees archivos `.env` con datos sensibles
- **Vite**: Las variables del frontend deben empezar con `VITE_` para ser accesibles
- **CORS**: En producción, especifica explícitamente los dominios permitidos
- **Base de Datos**: Asegúrate de que la ruta de la base de datos sea accesible desde el servidor

## Validación de Configuración

Para verificar que la configuración funciona correctamente:

1. **Backend**: Visita `http://localhost:8002/health`
2. **Frontend**: Verifica que la conexión con la API funcione en la aplicación
3. **CORS**: Comprueba que no hay errores de CORS en la consola del navegador