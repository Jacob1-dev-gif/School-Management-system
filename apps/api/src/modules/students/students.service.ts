import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    // Generate unique student ID
    const count = await this.prisma.student.count();
    const studentId = `STU${new Date().getFullYear()}${String(count + 1).padStart(5, '0')}`;

    return this.prisma.student.create({
      data: {
        ...data,
        studentId,
      },
      include: {
        school: true,
        user: true,
      },
    });
  }

  async findAll() {
    return this.prisma.student.findMany({
      include: {
        school: true,
        enrollments: {
          include: {
            class: true,
            academicYear: true,
          },
        },
        guardians: {
          include: {
            guardian: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.student.findUnique({
      where: { id },
      include: {
        school: true,
        enrollments: {
          include: {
            class: true,
            academicYear: true,
          },
        },
        guardians: {
          include: {
            guardian: true,
          },
        },
        attendances: true,
        assessments: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.student.update({
      where: { id },
      data,
      include: {
        school: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.student.delete({
      where: { id },
    });
  }

  async enrollStudent(data: { studentId: string; classId: string; academicYearId: string; enrollmentDate: string }) {
    return this.prisma.enrollment.create({
      data: {
        studentId: data.studentId,
        classId: data.classId,
        academicYearId: data.academicYearId,
        enrollmentDate: new Date(data.enrollmentDate),
        status: 'ACTIVE',
      },
      include: {
        student: true,
        class: true,
        academicYear: true,
      },
    });
  }
}
