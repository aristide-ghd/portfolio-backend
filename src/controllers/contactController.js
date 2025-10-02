const mailService = require('../services/mailService');

exports.sendContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    const subject = `New contact from ${name}`;
    const text = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    await mailService.sendMail({
      to: process.env.SITE_OWNER_EMAIL,
      from: email,
      subject,
      text,
    });

    res.json({ success: true, message: 'Message sent' });
  } catch (err) {
    next(err);
  }
};
