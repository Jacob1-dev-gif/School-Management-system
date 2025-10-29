import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AcademicsService {
  constructor(private prisma: PrismaService) {}

  // Academic Years
  async createAcademicYear(data: any) {
    if (data.isCurrent) {
      await this.prisma.academicYear.updateMany({
        where: { schoolId: data.schoolId },
        data: { isCurrent: false },
      });
    }

    return this.prisma.academicYear.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });
  }

  async findAllAcademicYears(schoolId?: string) {
    return this.prisma.academicYear.findMany({
      where: schoolId ? { schoolId } : undefined,
      include: {
        school: true,
        terms: true,
      },
      orderBy: { startDate: 'desc' },
    });
  }

  // Terms
  async createTerm(data: any) {
    if (data.isCurrent) {
      await this.prisma.term.updateMany({
        where: { academicYearId: data.academicYearId },
        data: { isCurrent: false },
      });
    }

    return this.prisma.term.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });
  }

  async findAllTerms(academicYearId?: string) {
    return this.prisma.term.findMany({
      where: academicYearId ? { academicYearId } : undefined,
      include: {
        academicYear: true,
      },
      orderBy: { startDate: 'asc' },
    });
  }

  // Classes
  async createClass(data: any) {
    return this.prisma.class.create({
      data,
      include: {
        academicYear: true,
        teacher: true,
      },
    });
  }

  async findAllClasses(academicYearId?: string) {
    return this.prisma.class.findMany({
      where: academicYearId ? { academicYearId } : undefined,
      include: {
        academicYear: true,
        teacher: true,
        enrollments: {
          include: {
            student: true,
          },
        },
      },
    });
  }

  // Subjects
  async createSubject(data: any) {
    return this.prisma.subject.create({
      data,
    });
  }

  async findAllSubjects() {
    return this.prisma.subject.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // Attendance
  async recordAttendance(data: any) {
    return this.prisma.attendance.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
      include: {
        student: true,
        class: true,
        subject: true,
      },
    });
  }

  async findAttendance(filters: { classId?: string; studentId?: string; date?: string }) {
    return this.prisma.attendance.findMany({
      where: {
        classId: filters.classId,
        studentId: filters.studentId,
        date: filters.date ? new Date(filters.date) : undefined,
      },
      include: {
        student: true,
        class: true,
        subject: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  // Assessments
  async recordAssessment(data: any) {
    return this.prisma.assessment.create({
      data,
      include: {
        student: true,
        subject: true,
        term: true,
      },
    });
  }

  async findAssessments(filters: { studentId?: string; subjectId?: string; termId?: string }) {
    return this.prisma.assessment.findMany({
      where: filters,
      include: {
        student: true,
        subject: true,
        term: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async computeTermAverage(studentId: string, termId: string) {
    const assessments = await this.prisma.assessment.findMany({
      where: { studentId, termId },
    });

    if (assessments.length === 0) {
      return { average: 0, assessments: [] };
    }

    // Group by subject
    const subjectScores = new Map<string, { total: number; count: number }>();

    for (const assessment of assessments) {
      const percentage = (assessment.score / assessment.maxScore) * 100;
      const weighted = (percentage * assessment.weight) / 100;

      if (!subjectScores.has(assessment.subjectId)) {
        subjectScores.set(assessment.subjectId, { total: 0, count: 0 });
      }

      const subject = subjectScores.get(assessment.subjectId);
      subject.total += weighted;
      subject.count += 1;
    }

    // Calculate overall average
    let totalAverage = 0;
    const subjectAverages = [];

    for (const [subjectId, { total, count }] of subjectScores.entries()) {
      const avg = total / count;
      totalAverage += avg;
      subjectAverages.push({ subjectId, average: avg });
    }

    const overallAverage = totalAverage / subjectScores.size;

    return {
      average: overallAverage,
      subjectAverages,
      assessments,
    };
  }

  // Grade Scales
  async findGradeScales() {
    return this.prisma.gradeScale.findMany({
      include: {
        gradeBands: {
          orderBy: { minScore: 'desc' },
        },
      },
    });
  }

  async getGrade(score: number, gradeScaleId?: string) {
    const gradeScale = gradeScaleId
      ? await this.prisma.gradeScale.findUnique({
          where: { id: gradeScaleId },
          include: { gradeBands: true },
        })
      : await this.prisma.gradeScale.findFirst({
          where: { isDefault: true },
          include: { gradeBands: true },
        });

    if (!gradeScale) return null;

    const band = gradeScale.gradeBands.find(
      (b) => score >= b.minScore && score <= b.maxScore,
    );

    return band;
  }
}
