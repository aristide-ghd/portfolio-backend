const nodemailer = require("nodemailer");

function buildTransport() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT, 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true";

  if (!host || !port || !user || !pass) {
    throw new Error("❌ SMTP configuration manquante (HOST, PORT, USER, PASS)");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    pool: true, // optimise connexions SMTP
    connectionTimeout: 10000, // 10s timeout
  });
}

function mockEmail({ to, subject, html, text }) {
  console.log("\n" + "=".repeat(80));
  console.log("📧 EMAIL MOCK (DEV)");
  console.log("=".repeat(80));
  console.log(`📨 À: ${to}`);
  console.log(`📋 Sujet: ${subject}`);
  console.log("\n📄 HTML:\n" + html);
  console.log("\n📄 TEXTE:\n" + text);
  console.log("=".repeat(80) + "\n");

  return Promise.resolve({
    messageId: "mock-" + Date.now(),
    accepted: [to],
    rejected: [],
    response: "Email affiché dans la console (mode développement)",
  });
}

async function sendMail({ to, subject, html, text, replyTo }) {
  if (!to || !subject) {
    throw new Error("❌ 'to' et 'subject' sont obligatoires pour sendMail()");
  }

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const isDev = process.env.NODE_ENV === "development";
  const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

  if (isDev && !hasSmtp) {
    return mockEmail({ to, subject, html, text });
  }

  try {
    const transporter = buildTransport();
    const result = await transporter.sendMail({ from, to, subject, html, text, replyTo });
    console.info(`📧 Email envoyé à ${to} (${result.messageId})`);
    return result;
  } catch (err) {
    console.error("❌ Erreur envoi email:", err.stack || err.message);
    if (isDev) {
      console.log("🔄 Fallback vers console...");
      return mockEmail({ to, subject, html, text });
    }
    throw err;
  }
}

module.exports = { sendMail };
