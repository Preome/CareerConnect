const nodemailer = require("nodemailer");

// Create transporter with credentials if available, otherwise stub
let transporter;
const mailUser = process.env.MAIL_USER;
const mailPass = process.env.MAIL_PASS;

if (mailUser && mailPass) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: mailUser,
      pass: mailPass,
    },
  });
} else {
  // Stub transporter when credentials are missing
  transporter = {
    sendMail: async (mailOptions) => {
      console.warn("⚠️ MAIL_USER or MAIL_PASS not set — email stubbed:", {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
      });
      return { messageId: "stubbed-message-id" };
    },
  };
}

async function sendEmail({ to, subject, text }) {
  await transporter.sendMail({
    from: mailUser || "noreply@careerconnect.local",
    to,
    subject,
    text,
  });
}

module.exports = { sendEmail };
