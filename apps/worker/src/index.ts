import pino from 'pino';
import { Queue, Worker } from 'bullmq';
import { connection } from './lib/redis';
import { emailWorker } from './workers/email.worker';
import { smsWorker } from './workers/sms.worker';
import { reportWorker } from './workers/report.worker';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

async function main() {
  logger.info('🚀 Starting worker service...');

  // Create queues
  const emailQueue = new Queue('email', { connection });
  const smsQueue = new Queue('sms', { connection });
  const reportQueue = new Queue('reports', { connection });

  logger.info('✅ Queues created');

  // Start workers
  const emailWorkerInstance = new Worker('email', emailWorker, { connection });
  const smsWorkerInstance = new Worker('sms', smsWorker, { connection });
  const reportWorkerInstance = new Worker('reports', reportWorker, { connection });

  logger.info('✅ Workers started');

  // Handle graceful shutdown
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, closing workers...');
    await emailWorkerInstance.close();
    await smsWorkerInstance.close();
    await reportWorkerInstance.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.info('SIGINT received, closing workers...');
    await emailWorkerInstance.close();
    await smsWorkerInstance.close();
    await reportWorkerInstance.close();
    process.exit(0);
  });

  logger.info('🎉 Worker service running');
}

main().catch((error) => {
  console.error('Failed to start worker service:', error);
  process.exit(1);
});
