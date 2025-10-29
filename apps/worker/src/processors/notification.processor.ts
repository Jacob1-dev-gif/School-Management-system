import { Job } from 'bullmq';
import * as nodemailer from 'nodemailer';

const emailTransporter = nodemailer.createTransport({
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

export async function notificationProcessor(job: Job) {
  const { type, recipient, subject, message } = job.data;

  console.log(`Processing notification job ${job.id}: ${type} to ${recipient}`);

  if (type === 'EMAIL') {
    try {
      await emailTransporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@school.local',
        to: recipient,
        subject,
        text: message,
        html: message,
      });

      return { success: true, sentAt: new Date() };
    } catch (error) {
      console.error('Email sending failed:', error.message);
      throw error;
    }
  } else if (type === 'SMS') {
    // Log-based SMS (stub)
    console.log(`📱 SMS to ${recipient}: ${message}`);
    return { success: true, sentAt: new Date(), provider: 'log' };
  }

  throw new Error(`Unknown notification type: ${type}`);
}
