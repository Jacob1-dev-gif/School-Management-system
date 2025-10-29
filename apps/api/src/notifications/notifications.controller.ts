import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send notification' })
  send(@Body() data: any) {
    return this.notificationsService.sendNotification(data);
  }

  @Get()
  @ApiOperation({ summary: 'List notifications' })
  findAll(@Query('userId') userId?: string) {
    return this.notificationsService.findAll(userId);
  }
}
