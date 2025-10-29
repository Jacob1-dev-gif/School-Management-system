import { Job } from 'bullmq';
import nodemailer from 'nodemailer';
import pino from 'pino';

const logger = pino();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '1025'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    : undefined,
});

export async function emailWorker(job: Job) {
  const { recipient, subject, message, html } = job.data;

  logger.info(`Sending email to ${recipient}: ${subject}`);

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@school.local',
      to: recipient,
      subject,
      text: message,
      html: html || message,
    });

    logger.info(`✅ Email sent to ${recipient}`);
    return { success: true };
  } catch (error) {
    logger.error(`❌ Failed to send email to ${recipient}:`, error);
    throw error;
  }
}
