const express      = require('express');
const path         = require('path');
const cors         = require('cors');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const swaggerUi    = require('swagger-ui-express');
const swaggerSpec  = require('./swagger');

const app = express();

// ── Seguridad: Helmet ─────────────────────────────────
app.use(helmet());

// ── Seguridad: CORS ───────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://studysync-api-prv0.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ── Seguridad: Rate Limiting ──────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { ok: false, mensaje: 'Demasiadas peticiones, intentá en 15 minutos' }
});
app.use(limiter);

// ── Middlewares generales ─────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ── Swagger UI ────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Rutas ─────────────────────────────────────────────
const authRoutes   = require('./routes/authRoutes');
const grupoRoutes  = require('./routes/gruposRoutes');

app.use('/auth',       authRoutes);
app.use('/api/grupos', grupoRoutes);

// ── Ruta raíz ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ── Middleware de errores global ──────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
});

module.exports = app;