const express = require('express');
const path = require('path');
const app = express();

const API_TARGETS = {
  production: 'https://wedding-api-production-2678.up.railway.app',
  qa: 'https://wedding-api-qa.up.railway.app'
};
const railwayContext = [
  process.env.RAILWAY_ENVIRONMENT_NAME,
  process.env.RAILWAY_GIT_BRANCH
].filter(Boolean).join(' ');
const inferredEnvironment = /(^|[^a-z0-9])qa($|[^a-z0-9])/i.test(railwayContext)
  ? 'qa'
  : 'production';
const environment = process.env.APP_ENV || process.argv[2] || inferredEnvironment;
const API_TARGET = process.env.API_TARGET || API_TARGETS[environment];

if (!API_TARGET) {
  throw new Error(`Entorno desconocido: ${environment}. Usa "qa" o "production".`);
}

app.get('/runtime-config.json', (req, res) => {
  res.json({ isQA: environment === 'qa' });
});

// Proxy hacia la API para evitar bloqueos de CORS en producción
app.use('/api', express.json(), async (req, res) => {
  try {
    const targetUrl = `${API_TARGET}/api${req.url}`;
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body)
    });
    const contentType = response.headers.get('content-type') || '';
    res.status(response.status);
    if (contentType.includes('application/json')) {
      res.json(await response.json());
    } else {
      res.send(await response.text());
    }
  } catch (err) {
    console.error('Error en proxy /api:', err);
    res.status(502).json({ message: 'Error al conectar con la API' });
  }
});

// Servir archivos estáticos desde la carpeta dist
app.use(express.static(path.join(__dirname, 'dist/dashboard-app/browser')));

// Para rutas SPA, devolver index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/dashboard-app/browser/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT} (${environment}: ${API_TARGET})`);
});
