const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { validateContact } = require('../validators/contactValidator');
const rateLimiter = require('../middleware/rateLimiter');

router.post('/', rateLimiter, validateContact, contactController.sendContact);

module.exports = router;
