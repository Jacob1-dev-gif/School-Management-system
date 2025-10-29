import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import * as dotenv from 'dotenv';
import { notificationProcessor } from './processors/notification.processor';
import { reportProcessor } from './processors/report.processor';

dotenv.config();

const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

// Notification worker
const notificationWorker = new Worker('notifications', notificationProcessor, {
  connection: redisConnection,
  concurrency: parseInt(process.env.WORKER_CONCURRENCY || '5'),
});

// Report worker
const reportWorker = new Worker('reports', reportProcessor, {
  connection: redisConnection,
  concurrency: parseInt(process.env.WORKER_CONCURRENCY || '5'),
});

notificationWorker.on('completed', (job) => {
  console.log(`✅ Notification job ${job.id} completed`);
});

notificationWorker.on('failed', (job, err) => {
  console.error(`❌ Notification job ${job?.id} failed:`, err.message);
});

reportWorker.on('completed', (job) => {
  console.log(`✅ Report job ${job.id} completed`);
});

reportWorker.on('failed', (job, err) => {
  console.error(`❌ Report job ${job?.id} failed:`, err.message);
});

console.log('🚀 Worker started');
console.log('📬 Listening for jobs on queues: notifications, reports');

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  await notificationWorker.close();
  await reportWorker.close();
  await redisConnection.quit();
  process.exit(0);
});
