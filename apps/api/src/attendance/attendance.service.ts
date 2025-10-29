import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async recordAttendance(data: any, userId: string) {
    return this.prisma.attendance.create({
      data: { ...data, createdBy: userId },
    });
  }

  async bulkRecordAttendance(records: any[], userId: string) {
    return this.prisma.attendance.createMany({
      data: records.map(r => ({ ...r, createdBy: userId })),
    });
  }

  async getAttendanceByClass(classId: string, date: Date) {
    return this.prisma.attendance.findMany({
      where: { classId, date },
      include: { student: true, subject: true },
    });
  }

  async getAttendanceByStudent(studentId: string, termId: string) {
    return this.prisma.attendance.findMany({
      where: { studentId, termId },
      include: { class: true, subject: true },
      orderBy: { date: 'desc' },
    });
  }

  async getAttendanceSummary(studentId: string, termId: string) {
    const attendances = await this.prisma.attendance.findMany({
      where: { studentId, termId },
    });

    const summary = {
      total: attendances.length,
      present: attendances.filter(a => a.status === 'PRESENT').length,
      absent: attendances.filter(a => a.status === 'ABSENT').length,
      late: attendances.filter(a => a.status === 'LATE').length,
      excused: attendances.filter(a => a.status === 'EXCUSED').length,
    };

    return {
      ...summary,
      percentage: summary.total > 0 ? (summary.present / summary.total) * 100 : 0,
    };
  }
}
