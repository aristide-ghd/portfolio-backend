const mailService = require('../services/mailService');
const Contact = require('../models/contact');

exports.sendContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    const subject = `New contact from ${name}`;
    const text = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    // Save to DB only if MONGO_URI is configured. Failures here won't prevent sending the email.
    let saved;
    if (process.env.MONGO_URI) {
      try {
        saved = await Contact.create({
          name,
          email,
          message,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
        });
      } catch (dbErr) {
        console.error('Failed to save contact to DB:', dbErr);
      }
    }

    await mailService.sendMail({
      to: process.env.SITE_OWNER_EMAIL,
      from: email,
      subject,
      text,
    });

    res.json({ success: true, message: 'Message sent', id: saved ? saved._id : undefined });
  } catch (err) {
    next(err);
  }
};
