const express = require('express');
const path = require('path');
const app = express();

const API_TARGET = 'https://wedding-api-production-2678.up.railway.app';

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
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
