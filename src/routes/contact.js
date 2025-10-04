const express = require('express');
const router = express.Router();
const { sendContact } = require('../controllers/contactController');
const { yupValidator } = require('../middleware/yup');
const { contactSchema } = require('../validators/contact.dto');
const { limiter } = require('../middleware/rateLimiting');

/**
 * @route   POST /contact
 * @desc    Soumettre un formulaire de contact
 * @access  Public
 */
router.post(
  '/contact', 
  limiter, // Appliquer la limitation de taux 
  yupValidator(contactSchema, 'body'), 
  sendContact  // Utiliser la fonction sendContact exportée
);

module.exports = router;
