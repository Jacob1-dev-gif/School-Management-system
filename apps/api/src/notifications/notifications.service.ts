import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async sendNotification(data: {
    userId?: string;
    recipient: string;
    subject?: string;
    message: string;
    type: string;
  }) {
    const provider = await this.prisma.notificationProvider.findFirst({
      where: { type: data.type, active: true },
    });

    if (!provider) {
      throw new Error(`No active provider found for type ${data.type}`);
    }

    const notification = await this.prisma.notification.create({
      data: {
        providerId: provider.id,
        userId: data.userId,
        recipient: data.recipient,
        subject: data.subject,
        message: data.message,
        type: data.type,
        status: 'PENDING',
      },
    });

    // TODO: Queue notification for worker to process
    console.log(`Notification queued: ${notification.id}`);

    return notification;
  }

  async findAll(userId?: string) {
    return this.prisma.notification.findMany({
      where: userId ? { userId } : undefined,
      include: { provider: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsSent(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { status: 'SENT', sentAt: new Date() },
    });
  }

  async markAsFailed(id: string, errorMsg: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { status: 'FAILED', errorMsg },
    });
  }
}
