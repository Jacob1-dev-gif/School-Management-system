import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get()
  @ApiOperation({ summary: 'List students' })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.studentsService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by ID' })
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create student' })
  create(@Body() data: any) {
    return this.studentsService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update student' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.studentsService.update(id, data);
  }

  @Post(':id/enroll')
  @ApiOperation({ summary: 'Enroll student in class' })
  enroll(@Param('id') id: string, @Body() data: any) {
    return this.studentsService.enroll(id, data.classId, data.academicYearId);
  }

  @Post(':id/guardians/:guardianId')
  @ApiOperation({ summary: 'Assign guardian to student' })
  assignGuardian(@Param('id') id: string, @Param('guardianId') guardianId: string) {
    return this.studentsService.assignGuardian(id, guardianId);
  }
}
