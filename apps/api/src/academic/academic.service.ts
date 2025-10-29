import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AcademicService {
  constructor(private prisma: PrismaService) {}

  // Academic Years
  async findAllAcademicYears() {
    return this.prisma.academicYear.findMany({
      include: { school: true, terms: true },
      orderBy: { startDate: 'desc' },
    });
  }

  async createAcademicYear(data: any) {
    return this.prisma.academicYear.create({ data });
  }

  async updateAcademicYear(id: string, data: any) {
    return this.prisma.academicYear.update({ where: { id }, data });
  }

  // Terms
  async findAllTerms(academicYearId?: string) {
    return this.prisma.term.findMany({
      where: academicYearId ? { academicYearId } : undefined,
      include: { academicYear: true },
    });
  }

  async createTerm(data: any) {
    return this.prisma.term.create({ data });
  }

  async updateTerm(id: string, data: any) {
    return this.prisma.term.update({ where: { id }, data });
  }

  // Classes
  async findAllClasses(academicYearId?: string) {
    return this.prisma.class.findMany({
      where: academicYearId ? { academicYearId } : undefined,
      include: { academicYear: true, classSubjects: { include: { subject: true } } },
    });
  }

  async createClass(data: any) {
    return this.prisma.class.create({ data });
  }

  async updateClass(id: string, data: any) {
    return this.prisma.class.update({ where: { id }, data });
  }

  // Subjects
  async findAllSubjects() {
    return this.prisma.subject.findMany();
  }

  async createSubject(data: any) {
    return this.prisma.subject.create({ data });
  }

  async updateSubject(id: string, data: any) {
    return this.prisma.subject.update({ where: { id }, data });
  }

  async assignSubjectToClass(classId: string, subjectId: string) {
    return this.prisma.classSubject.create({
      data: { classId, subjectId },
    });
  }
}
