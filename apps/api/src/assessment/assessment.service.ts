import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AssessmentService {
  constructor(private prisma: PrismaService) {}

  async recordAssessment(data: any, userId: string) {
    return this.prisma.assessment.create({
      data: { ...data, createdBy: userId },
    });
  }

  async getAssessmentsByStudent(studentId: string, termId: string) {
    return this.prisma.assessment.findMany({
      where: { studentId, termId },
      include: { subject: true, term: true },
      orderBy: { date: 'desc' },
    });
  }

  async getAssessmentsBySubject(subjectId: string, termId: string) {
    return this.prisma.assessment.findMany({
      where: { subjectId, termId },
      include: { student: true },
    });
  }

  async computeTermAverage(studentId: string, subjectId: string, termId: string) {
    const assessments = await this.prisma.assessment.findMany({
      where: { studentId, subjectId, termId },
    });

    if (assessments.length === 0) return null;

    // Compute weighted average
    let totalWeight = 0;
    let weightedSum = 0;

    for (const assessment of assessments) {
      const weight = assessment.weight || 1;
      const normalizedScore = (assessment.score / assessment.maxScore) * 100;
      weightedSum += normalizedScore * weight;
      totalWeight += weight;
    }

    const average = totalWeight > 0 ? weightedSum / totalWeight : 0;

    // Get grade band
    const gradeBand = await this.getGradeBand(average);

    return {
      studentId,
      subjectId,
      termId,
      average: Math.round(average * 100) / 100,
      gradeBand,
      assessments,
    };
  }

  async getGradeBand(score: number) {
    const gradeScale = await this.prisma.gradeScale.findFirst({
      where: { isDefault: true },
      include: { gradeBands: true },
    });

    if (!gradeScale) return null;

    return gradeScale.gradeBands.find(
      band => score >= band.minScore && score <= band.maxScore
    );
  }

  async getStudentTermReport(studentId: string, termId: string) {
    const subjects = await this.prisma.assessment.findMany({
      where: { studentId, termId },
      select: { subjectId: true },
      distinct: ['subjectId'],
    });

    const report = [];
    for (const { subjectId } of subjects) {
      const average = await this.computeTermAverage(studentId, subjectId, termId);
      if (average) report.push(average);
    }

    return report;
  }
}
