import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { createStudentSchema, createEnrollmentSchema } from '@school/shared';

@ApiTags('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Post()
  @Roles('ADMIN', 'PRINCIPAL', 'REGISTRAR')
  @ApiOperation({ summary: 'Create student' })
  create(@Body() body: any) {
    const data = createStudentSchema.parse(body);
    return this.studentsService.create(data);
  }

  @Get()
  @Roles('ADMIN', 'PRINCIPAL', 'REGISTRAR', 'TEACHER')
  @ApiOperation({ summary: 'Get all students' })
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'PRINCIPAL', 'REGISTRAR', 'TEACHER')
  @ApiOperation({ summary: 'Get student by ID' })
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Put(':id')
  @Roles('ADMIN', 'PRINCIPAL', 'REGISTRAR')
  @ApiOperation({ summary: 'Update student' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.studentsService.update(id, body);
  }

  @Delete(':id')
  @Roles('ADMIN', 'PRINCIPAL')
  @ApiOperation({ summary: 'Delete student' })
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }

  @Post('enroll')
  @Roles('ADMIN', 'PRINCIPAL', 'REGISTRAR')
  @ApiOperation({ summary: 'Enroll student in class' })
  enroll(@Body() body: any) {
    const data = createEnrollmentSchema.parse(body);
    return this.studentsService.enrollStudent(data);
  }
}
