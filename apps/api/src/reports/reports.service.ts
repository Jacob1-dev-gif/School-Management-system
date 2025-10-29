import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async generateReportCard(studentId: string, termId: string) {
    // Get student data
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        enrollments: {
          where: { academicYear: { current: true } },
          include: { class: true, academicYear: true },
        },
      },
    });

    // Get term data
    const term = await this.prisma.term.findUnique({
      where: { id: termId },
      include: { academicYear: true },
    });

    // Get assessments
    const assessments = await this.prisma.assessment.findMany({
      where: { studentId, termId },
      include: { subject: true },
    });

    // Compute averages per subject
    const subjectAverages = {};
    for (const assessment of assessments) {
      if (!subjectAverages[assessment.subjectId]) {
        subjectAverages[assessment.subjectId] = {
          subject: assessment.subject,
          scores: [],
        };
      }
      subjectAverages[assessment.subjectId].scores.push({
        type: assessment.type,
        score: assessment.score,
        maxScore: assessment.maxScore,
        weight: assessment.weight || 1,
      });
    }

    const reportData = {
      student,
      term,
      academicYear: term.academicYear,
      subjects: Object.values(subjectAverages).map((s: any) => {
        const totalWeight = s.scores.reduce((sum, sc) => sum + sc.weight, 0);
        const weightedSum = s.scores.reduce(
          (sum, sc) => sum + ((sc.score / sc.maxScore) * 100 * sc.weight),
          0
        );
        const average = totalWeight > 0 ? weightedSum / totalWeight : 0;
        return {
          subject: s.subject,
          average: Math.round(average * 100) / 100,
          scores: s.scores,
        };
      }),
      generatedAt: new Date(),
    };

    // Save report card record
    const reportCard = await this.prisma.reportCard.upsert({
      where: {
        studentId_termId: { studentId, termId },
      },
      update: {
        data: JSON.stringify(reportData),
        generated: true,
      },
      create: {
        studentId,
        termId,
        data: JSON.stringify(reportData),
        generated: true,
      },
    });

    // TODO: Generate PDF using pdfmake
    // For now, just return the JSON data
    
    return { reportCard, data: reportData };
  }

  async downloadReportCard(id: string) {
    const reportCard = await this.prisma.reportCard.findUnique({
      where: { id },
    });

    if (!reportCard) {
      throw new Error('Report card not found');
    }

    return {
      reportCard,
      data: JSON.parse(reportCard.data),
    };
  }
}
