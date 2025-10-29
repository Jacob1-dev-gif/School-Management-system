import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AcademicService } from './academic.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('academic')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('academic')
export class AcademicController {
  constructor(private academicService: AcademicService) {}

  // Academic Years
  @Get('years')
  @ApiOperation({ summary: 'List academic years' })
  findAllAcademicYears() {
    return this.academicService.findAllAcademicYears();
  }

  @Post('years')
  @ApiOperation({ summary: 'Create academic year' })
  createAcademicYear(@Body() data: any) {
    return this.academicService.createAcademicYear(data);
  }

  @Put('years/:id')
  @ApiOperation({ summary: 'Update academic year' })
  updateAcademicYear(@Param('id') id: string, @Body() data: any) {
    return this.academicService.updateAcademicYear(id, data);
  }

  // Terms
  @Get('terms')
  @ApiOperation({ summary: 'List terms' })
  findAllTerms(@Query('academicYearId') academicYearId?: string) {
    return this.academicService.findAllTerms(academicYearId);
  }

  @Post('terms')
  @ApiOperation({ summary: 'Create term' })
  createTerm(@Body() data: any) {
    return this.academicService.createTerm(data);
  }

  @Put('terms/:id')
  @ApiOperation({ summary: 'Update term' })
  updateTerm(@Param('id') id: string, @Body() data: any) {
    return this.academicService.updateTerm(id, data);
  }

  // Classes
  @Get('classes')
  @ApiOperation({ summary: 'List classes' })
  findAllClasses(@Query('academicYearId') academicYearId?: string) {
    return this.academicService.findAllClasses(academicYearId);
  }

  @Post('classes')
  @ApiOperation({ summary: 'Create class' })
  createClass(@Body() data: any) {
    return this.academicService.createClass(data);
  }

  @Put('classes/:id')
  @ApiOperation({ summary: 'Update class' })
  updateClass(@Param('id') id: string, @Body() data: any) {
    return this.academicService.updateClass(id, data);
  }

  @Post('classes/:classId/subjects/:subjectId')
  @ApiOperation({ summary: 'Assign subject to class' })
  assignSubject(@Param('classId') classId: string, @Param('subjectId') subjectId: string) {
    return this.academicService.assignSubjectToClass(classId, subjectId);
  }

  // Subjects
  @Get('subjects')
  @ApiOperation({ summary: 'List subjects' })
  findAllSubjects() {
    return this.academicService.findAllSubjects();
  }

  @Post('subjects')
  @ApiOperation({ summary: 'Create subject' })
  createSubject(@Body() data: any) {
    return this.academicService.createSubject(data);
  }

  @Put('subjects/:id')
  @ApiOperation({ summary: 'Update subject' })
  updateSubject(@Param('id') id: string, @Body() data: any) {
    return this.academicService.updateSubject(id, data);
  }
}
