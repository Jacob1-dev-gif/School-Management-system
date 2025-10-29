import { Job } from 'bullmq';
import pino from 'pino';

const logger = pino();

export async function smsWorker(job: Job) {
  const { recipient, message } = job.data;

  logger.info(`Sending SMS to ${recipient}: ${message}`);

  // For development, just log the SMS
  // In production, integrate with SMS gateway (Orange Money, MTN, etc.)
  const provider = process.env.SMS_PROVIDER || 'log';

  if (provider === 'log') {
    logger.info(`📱 SMS (LOG): To ${recipient} - ${message}`);
    return { success: true, provider: 'log' };
  }

  // TODO: Implement actual SMS providers
  // Example: Orange Money SMS API, MTN MoMo API
  logger.warn(`SMS provider ${provider} not implemented yet`);
  
  return { success: false, error: 'Provider not implemented' };
}
