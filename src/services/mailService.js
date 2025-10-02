const nodemailer = require('nodemailer');

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  if ((process.env.MAILER || 'console') === 'console') {
    // simple logger transport
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('--- Mock send mail ---');
        console.log(mailOptions);
        return Promise.resolve({ accepted: [mailOptions.to] });
      },
    };
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 587,
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  return transporter;
}

exports.sendMail = async ({ to, from, subject, text, html }) => {
  const t = getTransporter();
  const mailOptions = {
    from: from || process.env.MAIL_USER,
    to,
    subject,
    text,
    html,
  };

  const info = await t.sendMail(mailOptions);
  return info;
};
