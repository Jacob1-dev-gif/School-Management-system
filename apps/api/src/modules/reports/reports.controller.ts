import { Controller, Get, Post, Param, Query, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post('report-cards/:studentId/:termId')
  @Roles('ADMIN', 'PRINCIPAL', 'TEACHER')
  @ApiOperation({ summary: 'Generate report card' })
  generateReportCard(
    @Param('studentId') studentId: string,
    @Param('termId') termId: string,
  ) {
    return this.reportsService.generateReportCard(studentId, termId);
  }

  @Get('report-cards')
  @Roles('ADMIN', 'PRINCIPAL', 'TEACHER', 'PARENT', 'STUDENT')
  @ApiOperation({ summary: 'Get report cards' })
  findReportCards(
    @Query('studentId') studentId?: string,
    @Query('termId') termId?: string,
  ) {
    return this.reportsService.findReportCards(studentId, termId);
  }

  @Get('report-cards/download/:id')
  @Roles('ADMIN', 'PRINCIPAL', 'TEACHER', 'PARENT', 'STUDENT')
  @ApiOperation({ summary: 'Download report card PDF' })
  async downloadReportCard(@Param('id') id: string, @Res() res: Response) {
    const { file, metadata } = await this.reportsService.downloadReportCard(id);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=report-card-${id}.json`);
    res.send(file);
  }
}
