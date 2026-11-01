const nodemailer = require('nodemailer');

const smtpConfigurado = Boolean(process.env.SMTP_HOST);

const transporter = smtpConfigurado
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    })
  : nodemailer.createTransport({ jsonTransport: true });

const remetente = process.env.MAIL_FROM || 'Calculadora Tributária NAF <nao-responder@calculadora-naf.local>';

// Sem SMTP configurado o e-mail não sai: a mensagem é apenas registrada no log do servidor.
async function enviarEmail(mensagem) {
  const info = await transporter.sendMail({ from: remetente, ...mensagem });
  if (!smtpConfigurado) {
    console.log('[e-mail simulado] SMTP_HOST não configurado:', info.message);
  }
  return { simulado: !smtpConfigurado };
}

module.exports = { enviarEmail };
