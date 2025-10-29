import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post()
  @ApiOperation({ summary: 'Record attendance' })
  record(@Body() data: any, @Request() req) {
    return this.attendanceService.recordAttendance(data, req.user.userId);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk record attendance' })
  bulkRecord(@Body() data: { records: any[] }, @Request() req) {
    return this.attendanceService.bulkRecordAttendance(data.records, req.user.userId);
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Get attendance by class and date' })
  getByClass(@Param('classId') classId: string, @Query('date') date: string) {
    return this.attendanceService.getAttendanceByClass(classId, new Date(date));
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get attendance by student' })
  getByStudent(@Param('studentId') studentId: string, @Query('termId') termId: string) {
    return this.attendanceService.getAttendanceByStudent(studentId, termId);
  }

  @Get('student/:studentId/summary')
  @ApiOperation({ summary: 'Get attendance summary for student' })
  getSummary(@Param('studentId') studentId: string, @Query('termId') termId: string) {
    return this.attendanceService.getAttendanceSummary(studentId, termId);
  }
}
