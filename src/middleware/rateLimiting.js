const rateLimit = require('express-rate-limit');

// default: 5 requests per hour per IP
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: 'Too many contact attempts from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {limiter};
