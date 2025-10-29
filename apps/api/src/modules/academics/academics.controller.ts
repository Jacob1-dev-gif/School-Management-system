import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AcademicsService } from './academics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  createAcademicYearSchema,
  createTermSchema,
  createClassSchema,
  createSubjectSchema,
  createAttendanceSchema,
  createAssessmentSchema,
} from '@school/shared';

@ApiTags('academics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('academics')
export class AcademicsController {
  constructor(private academicsService: AcademicsService) {}

  // Academic Years
  @Post('academic-years')
  @Roles('ADMIN', 'PRINCIPAL', 'REGISTRAR')
  @ApiOperation({ summary: 'Create academic year' })
  createAcademicYear(@Body() body: any) {
    const data = createAcademicYearSchema.parse(body);
    return this.academicsService.createAcademicYear(data);
  }

  @Get('academic-years')
  @Roles('ADMIN', 'PRINCIPAL', 'REGISTRAR', 'TEACHER')
  @ApiOperation({ summary: 'Get all academic years' })
  findAllAcademicYears(@Query('schoolId') schoolId?: string) {
    return this.academicsService.findAllAcademicYears(schoolId);
  }

  // Terms
  @Post('terms')
  @Roles('ADMIN', 'PRINCIPAL', 'REGISTRAR')
  @ApiOperation({ summary: 'Create term' })
  createTerm(@Body() body: any) {
    const data = createTermSchema.parse(body);
    return this.academicsService.createTerm(data);
  }

  @Get('terms')
  @Roles('ADMIN', 'PRINCIPAL', 'REGISTRAR', 'TEACHER')
  @ApiOperation({ summary: 'Get all terms' })
  findAllTerms(@Query('academicYearId') academicYearId?: string) {
    return this.academicsService.findAllTerms(academicYearId);
  }

  // Classes
  @Post('classes')
  @Roles('ADMIN', 'PRINCIPAL', 'REGISTRAR')
  @ApiOperation({ summary: 'Create class' })
  createClass(@Body() body: any) {
    const data = createClassSchema.parse(body);
    return this.academicsService.createClass(data);
  }

  @Get('classes')
  @Roles('ADMIN', 'PRINCIPAL', 'REGISTRAR', 'TEACHER')
  @ApiOperation({ summary: 'Get all classes' })
  findAllClasses(@Query('academicYearId') academicYearId?: string) {
    return this.academicsService.findAllClasses(academicYearId);
  }

  // Subjects
  @Post('subjects')
  @Roles('ADMIN', 'PRINCIPAL', 'REGISTRAR')
  @ApiOperation({ summary: 'Create subject' })
  createSubject(@Body() body: any) {
    const data = createSubjectSchema.parse(body);
    return this.academicsService.createSubject(data);
  }

  @Get('subjects')
  @Roles('ADMIN', 'PRINCIPAL', 'REGISTRAR', 'TEACHER')
  @ApiOperation({ summary: 'Get all subjects' })
  findAllSubjects() {
    return this.academicsService.findAllSubjects();
  }

  // Attendance
  @Post('attendance')
  @Roles('ADMIN', 'PRINCIPAL', 'TEACHER')
  @ApiOperation({ summary: 'Record attendance' })
  recordAttendance(@Body() body: any) {
    const data = createAttendanceSchema.parse(body);
    return this.academicsService.recordAttendance(data);
  }

  @Get('attendance')
  @Roles('ADMIN', 'PRINCIPAL', 'TEACHER')
  @ApiOperation({ summary: 'Get attendance records' })
  findAttendance(
    @Query('classId') classId?: string,
    @Query('studentId') studentId?: string,
    @Query('date') date?: string,
  ) {
    return this.academicsService.findAttendance({ classId, studentId, date });
  }

  // Assessments
  @Post('assessments')
  @Roles('ADMIN', 'PRINCIPAL', 'TEACHER')
  @ApiOperation({ summary: 'Record assessment' })
  recordAssessment(@Body() body: any) {
    const data = createAssessmentSchema.parse(body);
    return this.academicsService.recordAssessment(data);
  }

  @Get('assessments')
  @Roles('ADMIN', 'PRINCIPAL', 'TEACHER')
  @ApiOperation({ summary: 'Get assessments' })
  findAssessments(
    @Query('studentId') studentId?: string,
    @Query('subjectId') subjectId?: string,
    @Query('termId') termId?: string,
  ) {
    return this.academicsService.findAssessments({ studentId, subjectId, termId });
  }

  @Get('assessments/average/:studentId/:termId')
  @Roles('ADMIN', 'PRINCIPAL', 'TEACHER')
  @ApiOperation({ summary: 'Compute term average for student' })
  computeTermAverage(@Param('studentId') studentId: string, @Param('termId') termId: string) {
    return this.academicsService.computeTermAverage(studentId, termId);
  }

  // Grade Scales
  @Get('grade-scales')
  @Roles('ADMIN', 'PRINCIPAL', 'TEACHER')
  @ApiOperation({ summary: 'Get grade scales' })
  findGradeScales() {
    return this.academicsService.findGradeScales();
  }

  @Get('grade-scales/grade/:score')
  @Roles('ADMIN', 'PRINCIPAL', 'TEACHER')
  @ApiOperation({ summary: 'Get grade for score' })
  getGrade(@Param('score') score: number, @Query('gradeScaleId') gradeScaleId?: string) {
    return this.academicsService.getGrade(Number(score), gradeScaleId);
  }
}
