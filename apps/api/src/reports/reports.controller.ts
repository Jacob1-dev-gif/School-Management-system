import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post('report-cards/generate')
  @ApiOperation({ summary: 'Generate report card' })
  generateReportCard(@Query('studentId') studentId: string, @Query('termId') termId: string) {
    return this.reportsService.generateReportCard(studentId, termId);
  }

  @Get('report-cards/:id/download')
  @ApiOperation({ summary: 'Download report card' })
  downloadReportCard(@Param('id') id: string) {
    return this.reportsService.downloadReportCard(id);
  }
}
