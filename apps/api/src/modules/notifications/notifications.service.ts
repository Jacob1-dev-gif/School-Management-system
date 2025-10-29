import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private emailTransporter: nodemailer.Transporter;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.emailTransporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: parseInt(this.configService.get('SMTP_PORT') || '1025'),
      secure: this.configService.get('SMTP_SECURE') === 'true',
      auth: this.configService.get('SMTP_USER')
        ? {
            user: this.configService.get('SMTP_USER'),
            pass: this.configService.get('SMTP_PASSWORD'),
          }
        : undefined,
    });
  }

  async sendEmail(recipient: string, subject: string, message: string) {
    const notification = await this.prisma.notification.create({
      data: {
        type: 'EMAIL',
        recipient,
        subject,
        message,
        status: 'PENDING',
      },
    });

    try {
      await this.emailTransporter.sendMail({
        from: this.configService.get('SMTP_FROM') || 'noreply@school.local',
        to: recipient,
        subject,
        text: message,
        html: message,
      });

      await this.prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      return { success: true, notification };
    } catch (error) {
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: 'FAILED',
          error: error.message,
        },
      });

      return { success: false, error: error.message };
    }
  }

  async sendSMS(recipient: string, message: string) {
    const notification = await this.prisma.notification.create({
      data: {
        type: 'SMS',
        recipient,
        message,
        status: 'PENDING',
      },
    });

    // Log-based SMS provider (stub for now)
    console.log(`📱 SMS to ${recipient}: ${message}`);

    await this.prisma.notification.update({
      where: { id: notification.id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        metadata: JSON.stringify({ provider: 'log', method: 'console' }),
      },
    });

    return { success: true, notification };
  }

  async findAll(filters?: { type?: string; status?: string }) {
    return this.prisma.notification.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
