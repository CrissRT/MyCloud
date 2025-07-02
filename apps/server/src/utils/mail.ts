import dayjs from 'dayjs';
import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

import { getEmail, getEmailPassword, getEmailService, getFrontendUrl } from './constants';

// Get the directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the email template
const emailTemplate = fs.readFileSync(path.join(__dirname, '../templates/email.html'), 'utf8');
const email = getEmail();
const frontendUrl = getFrontendUrl();

const transporter = nodemailer.createTransport({
  service: getEmailService(),
  auth: {
    user: email,
    pass: getEmailPassword()
  }
});

const _sendEmail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: email,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
  console.log(`Email sent to ${to}`);
};

export const sendResetPasswordEmail = async (fullName: string, toEmail: string, resetToken: string) => {
  const subject = 'Reset Your Password';
  // Replace template variables
  const emailHtml = emailTemplate
    .replace(/{{USER_NAME}}/g, fullName)
    .replace(/{{USER_EMAIL}}/g, toEmail)
    .replace(/{{RESET_URL}}/g, `${frontendUrl}/reset-password?token=${resetToken}`)
    .replace(/{{CURRENT_YEAR}}/g, dayjs().format('YYYY'))
    .replace(/{{WEBSITE_URL}}/g, frontendUrl)
    .replace(/{{PRIVACY_URL}}/g, 'https://mycloud.com/privacy')
    .replace(/{{TERMS_URL}}/g, 'https://mycloud.com/terms');

  await _sendEmail(toEmail, subject, emailHtml);
};
