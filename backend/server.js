import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import productRoutes from './routes/products.js';

// Configuración
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger simple para desarrollo
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API de Catálogo de Productos',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      health: '/api/health',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api/products', productRoutes);

// Middleware de error 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {},
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║   🚀 Servidor corriendo en puerto ${PORT}                         ║
║   📝 Entorno: ${process.env.NODE_ENV || 'development'}            ║
╚═══════════════════════════════════════════════════════════════════╝
  `);
});

export default app;
