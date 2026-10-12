# Deployment en Railway

## Archivos agregados/modificados

1. **server.js** - Servidor Express que sirve la aplicación Angular compilada
2. **Dockerfile** - Configuración multi-etapa para construir y servir la app
3. **railway.toml** - Configuración de Railway
4. **.dockerignore** - Archivos a excluir del build

## Scripts disponibles

- `npm start` - Build para producción + servidor (para Railway)
- `npm run start:qa` - Build + servidor conectado a la API de QA
- `npm run dev` - Servidor de desarrollo (ng serve)
- `npm run dev:qa` - Servidor de desarrollo conectado a la API de QA
- `npm run build` - Build para producción
- `npm run build:dev` - Build en modo desarrollo con watch

## Cómo hacer deploy en Railway

### Opción 1: Usar Railway CLI (recomendado)

```bash
# 1. Instalar Railway CLI (si no lo tienes)
npm i -g @railway/cli

# 2. Login
railway login

# 3. Crear nuevo proyecto
railway init

# 4. Deploy
railway up
```

### Opción 2: Conectar repositorio Git

1. Ir a [Railway.app](https://railway.app)
2. Crear nuevo proyecto
3. Conectar tu repositorio GitHub
4. Railway detectará automáticamente que es un proyecto Node.js
5. Deploy se hará automáticamente

### Opción 3: Usar Dockerfile directamente

Si prefieres usar Docker:
```bash
docker build -t dashboard-app .
docker run -p 3000:3000 dashboard-app
```

## Variables de entorno

- `PORT` - Puerto en el que ejecutar el servidor (default: 3000)
- `APP_ENV` - Entorno del servidor: `production` (default) o `qa`
- `API_TARGET` - URL opcional para sobrescribir la API seleccionada
- Railway asigna automáticamente el puerto en su entorno

El servidor detecta QA automáticamente cuando el nombre del entorno o la rama
de Railway contiene `QA`. También puedes fijar el entorno con `APP_ENV=qa` en
las variables del servicio. Producción sigue siendo el valor predeterminado.

## Notas importantes

- El servidor escucha en el puerto asignado por Railway (variable `PORT`)
- Todos los archivos estáticos se sirven desde `dist/dashboard-app/browser/`
- Las rutas SPA se manejan correctamente (redirect a index.html)
- Build de producción se ejecuta automáticamente en el deploy

¡Listo! Tu proyecto debería funcionar correctamente en Railway.
