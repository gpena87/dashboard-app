const express = require('express');
const path = require('path');
const app = express();

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
