import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AssessmentService } from './assessment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('assessment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assessment')
export class AssessmentController {
  constructor(private assessmentService: AssessmentService) {}

  @Post()
  @ApiOperation({ summary: 'Record assessment' })
  record(@Body() data: any, @Request() req) {
    return this.assessmentService.recordAssessment(data, req.user.userId);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get assessments by student' })
  getByStudent(@Param('studentId') studentId: string, @Query('termId') termId: string) {
    return this.assessmentService.getAssessmentsByStudent(studentId, termId);
  }

  @Get('subject/:subjectId')
  @ApiOperation({ summary: 'Get assessments by subject' })
  getBySubject(@Param('subjectId') subjectId: string, @Query('termId') termId: string) {
    return this.assessmentService.getAssessmentsBySubject(subjectId, termId);
  }

  @Get('student/:studentId/subject/:subjectId/average')
  @ApiOperation({ summary: 'Compute term average' })
  computeAverage(
    @Param('studentId') studentId: string,
    @Param('subjectId') subjectId: string,
    @Query('termId') termId: string,
  ) {
    return this.assessmentService.computeTermAverage(studentId, subjectId, termId);
  }

  @Get('student/:studentId/report')
  @ApiOperation({ summary: 'Get student term report' })
  getReport(@Param('studentId') studentId: string, @Query('termId') termId: string) {
    return this.assessmentService.getStudentTermReport(studentId, termId);
  }
}
