const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const contactRouter = require('./routes/contact');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
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
