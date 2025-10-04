const Contact = require("../models/contact");
const mailService = require("../services/mailService");

/**
 * ==========================
 * 🔹 Envoi d'un message de contact
 * ==========================
 */
const sendContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Nom, email et message sont requis.",
      });
    }

    let saved;
    if (process.env.MONGO_URI) {
      try {
        saved = await Contact.create({
          name,
          email,
          message,
          ip: req.ip,
          userAgent: req.get("User-Agent"),
        });
      } catch (dbErr) {
        console.error("[contact] Erreur DB:", dbErr.message);
      }
    }

    const subject = `📩 Nouveau message de ${name}`;
    const text = `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    await mailService.sendMail({
      to: process.env.SITE_OWNER_EMAIL,
      from: email,
      subject,
      text,
    });

    return res.status(201).json({
      success: true,
      message: "Message envoyé avec succès.",
      contact: {
        id: saved ? saved._id : undefined,
        name,
        email,
      },
    });
  } catch (err) {
    console.error("[contact] Erreur serveur:", err.stack || err.message);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur, réessayez plus tard.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

module.exports = { sendContact };
