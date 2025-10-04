const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const contactRouter = require('./routes/contact');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Autorise les requêtes sans origine (comme Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    console.warn(`❌ CORS refusé pour l'origine: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());
app.use(morgan('tiny'));

app.get('/', (req, res) => res.json({ ok: true, message: 'Portfolio backend' }));

app.use('/api/contact', contactRouter);

// 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use(errorHandler);

module.exports = app;
