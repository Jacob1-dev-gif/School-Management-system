import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.student.findMany({
        skip,
        take: limit,
        include: {
          enrollments: { include: { class: true, academicYear: true } },
          guardianStudents: { include: { guardian: true } },
        },
      }),
      this.prisma.student.count(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    return this.prisma.student.findUnique({
      where: { id },
      include: {
        enrollments: { include: { class: true, academicYear: true } },
        guardianStudents: { include: { guardian: true } },
        attendances: true,
        assessments: true,
      },
    });
  }

  async create(data: any) {
    // Generate student ID
    const count = await this.prisma.student.count();
    const studentId = data.studentId || `STU${String(count + 1).padStart(6, '0')}`;
    
    return this.prisma.student.create({
      data: { ...data, studentId },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.student.update({ where: { id }, data });
  }

  async enroll(studentId: string, classId: string, academicYearId: string) {
    return this.prisma.enrollment.create({
      data: { studentId, classId, academicYearId },
    });
  }

  async assignGuardian(studentId: string, guardianId: string, isPrimary = false) {
    return this.prisma.guardianStudent.create({
      data: { studentId, guardianId, isPrimary },
    });
  }
}
