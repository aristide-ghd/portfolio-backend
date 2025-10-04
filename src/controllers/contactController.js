const Contact = require("../models/contact");
const mailService = require("../services/mailer.service");

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
        message: "Nom, email et message sont requis."
      });
    }

    // Sauvegarde en DB (optionnelle)
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

    //  Email HTML stylé
    const subject = `📩 Nouveau message de ${name}`;
    const html = `
      <div style="
        font-family: 'Segoe UI', Roboto, sans-serif;
        background: #f7f8fa;
        padding: 20px;
        color: #333;
      ">
        <div style="
          max-width: 600px;
          margin: auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          overflow: hidden;
        ">
          <div style="background: #4f46e5; color: white; padding: 20px;">
            <h2 style="margin: 0;">💬 Nouveau message reçu</h2>
          </div>
          <div style="padding: 20px;">
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p style="margin-top: 20px;"><strong>Message :</strong></p>
            <div style="
              background: #f3f4f6;
              padding: 15px;
              border-radius: 8px;
              margin-top: 8px;
              white-space: pre-line;
              line-height: 1.5;
            ">
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>
          <div style="text-align: center; background: #f9fafb; padding: 15px; font-size: 0.9em; color: #777;">
            <p>📫 Message envoyé depuis le formulaire du portfolio</p>
          </div>
        </div>
      </div>
    `;

    const text = `
      Nouveau message de ${name}
      Email: ${email}

      Message:
      ${message}
          `;

    await mailService.sendMail({
      to: process.env.SITE_OWNER_EMAIL,
      subject,
      html,
      text,
      replyTo: email, // Pour que "Répondre" envoie au visiteur
    });

    return res.status(201).json({
      message: "Message envoyé avec succès.",
      contact: {
        id: saved ? saved._id : undefined,
        name,
        email,
      },
    });
  } catch (err) {
    console.error("[contact] Erreur serveur:", err.message);
    return res.status(500).json({
      message: "Erreur serveur, réessayez plus tard.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

module.exports = { sendContact };
