import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as PdfPrinter from 'pdfmake';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async generateReportCard(studentId: string, termId: string) {
    // Fetch student data
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        school: true,
        enrollments: {
          where: { status: 'ACTIVE' },
          include: {
            class: true,
          },
        },
      },
    });

    // Fetch term data
    const term = await this.prisma.term.findUnique({
      where: { id: termId },
      include: {
        academicYear: true,
      },
    });

    // Fetch assessments
    const assessments = await this.prisma.assessment.findMany({
      where: { studentId, termId },
      include: {
        subject: true,
      },
    });

    // Fetch attendance
    const attendances = await this.prisma.attendance.findMany({
      where: {
        studentId,
        date: {
          gte: term.startDate,
          lte: term.endDate,
        },
      },
    });

    // Calculate grades by subject
    const subjectGrades = new Map();
    const gradeScale = await this.prisma.gradeScale.findFirst({
      where: { isDefault: true },
      include: { gradeBands: true },
    });

    for (const assessment of assessments) {
      const percentage = (assessment.score / assessment.maxScore) * 100;
      
      if (!subjectGrades.has(assessment.subjectId)) {
        subjectGrades.set(assessment.subjectId, {
          subject: assessment.subject,
          scores: [],
          total: 0,
        });
      }

      const subjectData = subjectGrades.get(assessment.subjectId);
      subjectData.scores.push(percentage);
      subjectData.total += percentage;
    }

    const reportData = {
      student,
      term,
      subjects: [],
      attendance: {
        total: attendances.length,
        present: attendances.filter(a => a.status === 'PRESENT').length,
        absent: attendances.filter(a => a.status === 'ABSENT').length,
        late: attendances.filter(a => a.status === 'LATE').length,
      },
    };

    let totalAverage = 0;
    for (const [subjectId, data] of subjectGrades.entries()) {
      const average = data.total / data.scores.length;
      const gradeBand = gradeScale?.gradeBands.find(
        b => average >= b.minScore && average <= b.maxScore
      );

      reportData.subjects.push({
        name: data.subject.name,
        average: average.toFixed(2),
        grade: gradeBand?.grade || 'N/A',
      });

      totalAverage += average;
    }

    reportData['overallAverage'] = (totalAverage / subjectGrades.size).toFixed(2);

    // Create simple PDF (stub for now - would use pdfmake in production)
    const pdfPath = path.join(process.cwd(), 'uploads', 'reports', `${studentId}_${termId}.pdf`);
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(pdfPath), { recursive: true }).catch(() => {});

    // For now, just save JSON - in production, use pdfmake
    await fs.writeFile(pdfPath, JSON.stringify(reportData, null, 2));

    // Save report card record
    const reportCard = await this.prisma.reportCard.create({
      data: {
        studentId,
        termId,
        filePath: pdfPath,
        metadata: JSON.stringify(reportData),
        generatedAt: new Date(),
      },
    });

    return {
      reportCard,
      data: reportData,
      filePath: pdfPath,
    };
  }

  async findReportCards(studentId?: string, termId?: string) {
    return this.prisma.reportCard.findMany({
      where: {
        studentId,
        termId,
      },
      include: {
        student: true,
        term: {
          include: {
            academicYear: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async downloadReportCard(id: string) {
    const reportCard = await this.prisma.reportCard.findUnique({
      where: { id },
    });

    if (!reportCard || !reportCard.filePath) {
      throw new Error('Report card not found');
    }

    const fileContent = await fs.readFile(reportCard.filePath);
    return {
      file: fileContent,
      metadata: reportCard.metadata,
    };
  }
}
