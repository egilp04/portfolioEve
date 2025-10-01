import express from 'express';
import path from 'path';

function createServer() {
  const app = express();
  const distFolder = path.join(__dirname, 'dist/portfolioEve'); // Cambia portfolioEve por tu app
  const indexHtml = path.join(distFolder, 'index.html');

  // Servir archivos estáticos
  app.use(express.static(distFolder));

  // Redirigir todas las rutas a index.html
  app.get('*', (req, res) => {
    res.sendFile(indexHtml);
  });

  return app;
}

function run() {
  const PORT = process.env['PORT'] || 4200;
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

run();
