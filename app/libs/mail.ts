import { createTransport } from 'nodemailer'
import prisma from './prismaDB'


let transporter = createTransport(
  {
    host: process.env.EMAIL_SERVER_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD
    }
  }
);

function send(text: string, email: string, subject: string) {
  return transporter.sendMail({
    from: {
      name: 'E2E',
      address: process.env.EMAIL_FROM || '',
    },
    to: email,
    subject,
    text,
  });
}

export default async function sendOneTimePassword(email: string, id: string, subject = 'Confirm login') {
  const oneTimePassword = String(Math.floor(Math.random() * 999999)).padStart(6, '0');
  await prisma.user.update({
    data: { oneTimePassword },
    where: { id }
  });
  const text = 'Your one-time password is:\n' + oneTimePassword;
  await send(text, email, subject);
}