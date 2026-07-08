import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
export async function sendVerificationEmail(email, token) {
  const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: `"SUPMEAL" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Vérifiez votre adresse email — SUPMEAL",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #16a34a;">Bienvenue sur SUPMEAL 🍴</h2>
        <p>Cliquez sur le bouton ci-dessous pour vérifier votre adresse email :</p>
        <a href="${url}" style="display:inline-block;background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0;">
          Vérifier mon email
        </a>
        <p style="color:#888;font-size:12px;">Ce lien expire dans 24h.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email, token) {
  const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"SUPMEAL" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Réinitialisation de votre mot de passe — SUPMEAL",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #dc2626;">🔐 Réinitialisation du mot de passe</h2>
        <p>Vous avez demandé à réinitialiser votre mot de passe SUPMEAL.</p>
        <a href="${url}" style="display:inline-block;background:#dc2626;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0;">
          Réinitialiser mon mot de passe
        </a>
        <p style="color:#888;font-size:12px;">Ce lien expire dans 1h. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
      </div>
    `,
  });
}
