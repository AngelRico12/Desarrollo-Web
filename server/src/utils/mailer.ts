// utils/mailer.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mitsimy@gmail.com', // tu correo
    pass: 'nxkl umfw mmho geaa', // tu app password
  },
});

export async function enviarAlertaCorreo(destinatario: string, asunto: string, mensajeHTML: string) {
  const mailOptions = {
    from: 'mitsimy@gmail.com',
    to: destinatario,
    subject: asunto,
    html: mensajeHTML,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error enviando correo de alerta:', error);
  }
}
