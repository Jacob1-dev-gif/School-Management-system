import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post('email')
  @Roles('ADMIN', 'PRINCIPAL')
  @ApiOperation({ summary: 'Send email notification' })
  sendEmail(@Body() body: { recipient: string; subject: string; message: string }) {
    return this.notificationsService.sendEmail(body.recipient, body.subject, body.message);
  }

  @Post('sms')
  @Roles('ADMIN', 'PRINCIPAL')
  @ApiOperation({ summary: 'Send SMS notification' })
  sendSMS(@Body() body: { recipient: string; message: string }) {
    return this.notificationsService.sendSMS(body.recipient, body.message);
  }

  @Get()
  @Roles('ADMIN', 'PRINCIPAL')
  @ApiOperation({ summary: 'Get notifications' })
  findAll(@Query('type') type?: string, @Query('status') status?: string) {
    return this.notificationsService.findAll({ type, status });
  }
}
