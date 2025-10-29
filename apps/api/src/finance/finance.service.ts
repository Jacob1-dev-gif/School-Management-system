import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  // Fee Schedules
  async createFeeSchedule(data: any) {
    return this.prisma.feeSchedule.create({ data });
  }

  async findAllFeeSchedules() {
    return this.prisma.feeSchedule.findMany({
      include: { academicYear: true, term: true, class: true },
    });
  }

  // Invoices
  async createInvoice(data: any) {
    const count = await this.prisma.invoice.count();
    const invoiceNumber = `INV${String(count + 1).padStart(8, '0')}`;
    
    return this.prisma.invoice.create({
      data: { ...data, invoiceNumber },
    });
  }

  async findAllInvoices(studentId?: string) {
    return this.prisma.invoice.findMany({
      where: studentId ? { studentId } : undefined,
      include: { student: true, feeSchedule: true, payments: true },
    });
  }

  async findOneInvoice(id: string) {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: { student: true, feeSchedule: true, payments: true, receipts: true },
    });
  }

  // Payments
  async recordPayment(data: any) {
    const payment = await this.prisma.payment.create({ data });

    // Update invoice status
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: data.invoiceId },
      include: { payments: true },
    });

    const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amountLRD, 0);
    const status = totalPaid >= invoice.amountLRD ? 'PAID' : 
                   totalPaid > 0 ? 'PARTIAL' : 'PENDING';

    await this.prisma.invoice.update({
      where: { id: data.invoiceId },
      data: { status },
    });

    // Generate receipt
    const receiptCount = await this.prisma.receipt.count();
    const receiptNumber = `RCT${String(receiptCount + 1).padStart(8, '0')}`;

    const receipt = await this.prisma.receipt.create({
      data: {
        receiptNumber,
        invoiceId: data.invoiceId,
        paymentId: payment.id,
        amountLRD: data.amountLRD,
        amountUSD: data.amountUSD,
      },
    });

    return { payment, receipt };
  }

  async getStudentBalance(studentId: string) {
    const invoices = await this.prisma.invoice.findMany({
      where: { studentId },
      include: { payments: true },
    });

    const totalDue = invoices.reduce((sum, inv) => sum + inv.amountLRD, 0);
    const totalPaid = invoices.reduce(
      (sum, inv) => sum + inv.payments.reduce((s, p) => s + p.amountLRD, 0),
      0
    );

    return {
      totalDue,
      totalPaid,
      balance: totalDue - totalPaid,
      currency: 'LRD',
    };
  }

  async getArrearsReport() {
    const invoices = await this.prisma.invoice.findMany({
      where: { status: { in: ['PENDING', 'PARTIAL', 'OVERDUE'] } },
      include: { student: true, payments: true },
    });

    return invoices.map(invoice => {
      const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amountLRD, 0);
      return {
        student: invoice.student,
        invoiceNumber: invoice.invoiceNumber,
        totalDue: invoice.amountLRD,
        totalPaid,
        balance: invoice.amountLRD - totalPaid,
        status: invoice.status,
      };
    });
  }
}
