import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  // Note: We use a simple in-memory storage for datasets as requested
  const storage = {
    datasets: [] as any[],
  };

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.post('/api/datasets', (req, res) => {
    const { dataset } = req.body;
    if (!dataset) return res.status(400).json({ error: 'Dataset is required' });
    
    // Simulate storage
    storage.datasets.push(dataset);
    res.json({ message: 'Dataset stored successfully', id: storage.datasets.length });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Basic static serving for production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\x1b[36m%s\x1b[0m`, `
    ┌──────────────────────────────────────────────────┐
    │                                                  │
    │   Nexus Data Explorer - Backend Active           │
    │   URL: http://localhost:${PORT}                  │
    │   Mode: ${process.env.NODE_ENV || 'development'}     │
    │                                                  │
    └──────────────────────────────────────────────────┘
    `);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
