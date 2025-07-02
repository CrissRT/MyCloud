import nodemailer from 'nodemailer';

import { getEmail, getEmailPassword, getEmailService, getFrontendUrl } from './constants';

const email = getEmail();
const frontendUrl = getFrontendUrl();

const transporter = nodemailer.createTransport({
  service: getEmailService(),
  auth: {
    user: email,
    pass: getEmailPassword()
  }
});

const _sendEmail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: email,
    to,
    subject,
    text
  };

  await transporter.sendMail(mailOptions);
  console.log(`Email sent to ${to}`);
};

export const sendResetPasswordEmail = async (fullName: string, to: string, resetToken: string) => {
  const subject = 'Reset Your Password';
  const text =
    `Hello, ${fullName}\n\n` +
    `You requested a password reset. Click the link below to reset your password:\n\n` +
    `<a href="${frontendUrl}/reset-password?token=${resetToken}">Reset Password</a>\n\n` +
    `If you did not request this, please ignore this email.`;

  await _sendEmail(to, subject, text);
};
