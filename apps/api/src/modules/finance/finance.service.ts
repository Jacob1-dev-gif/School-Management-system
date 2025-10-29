import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  // Fees
  async createFee(data: any) {
    return this.prisma.fee.create({
      data,
      include: {
        academicYear: true,
        term: true,
      },
    });
  }

  async findAllFees(academicYearId?: string) {
    return this.prisma.fee.findMany({
      where: academicYearId ? { academicYearId } : undefined,
      include: {
        academicYear: true,
        term: true,
        feeSchedules: true,
      },
    });
  }

  // Fee Schedules
  async createFeeSchedule(data: any) {
    return this.prisma.feeSchedule.create({
      data: {
        ...data,
        dueDate: new Date(data.dueDate),
      },
      include: {
        fee: true,
      },
    });
  }

  // Invoices
  async createInvoice(data: any) {
    const count = await this.prisma.invoice.count();
    const invoiceNumber = `INV${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`;

    return this.prisma.invoice.create({
      data: {
        ...data,
        invoiceNumber,
        dueDate: new Date(data.dueDate),
      },
      include: {
        student: true,
        feeSchedule: {
          include: {
            fee: true,
          },
        },
      },
    });
  }

  async findInvoices(studentId?: string) {
    return this.prisma.invoice.findMany({
      where: studentId ? { studentId } : undefined,
      include: {
        student: true,
        feeSchedule: {
          include: {
            fee: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Payments
  async createPayment(data: any) {
    const payment = await this.prisma.payment.create({
      data,
      include: {
        invoice: {
          include: {
            payments: true,
          },
        },
      },
    });

    // Update invoice status
    const invoice = payment.invoice;
    const totalPaid = invoice.payments.reduce(
      (sum, p) => sum + (p.amountLRD || 0),
      0,
    );

    let status = 'PENDING';
    if (totalPaid >= invoice.amountLRD) {
      status = 'PAID';
    } else if (totalPaid > 0) {
      status = 'PARTIAL';
    } else if (new Date() > invoice.dueDate) {
      status = 'OVERDUE';
    }

    await this.prisma.invoice.update({
      where: { id: invoice.id },
      data: { status },
    });

    // Generate receipt
    const receiptCount = await this.prisma.receipt.count();
    const receiptNumber = `REC${new Date().getFullYear()}${String(receiptCount + 1).padStart(6, '0')}`;

    const receipt = await this.prisma.receipt.create({
      data: {
        paymentId: payment.id,
        receiptNumber,
      },
    });

    return {
      payment,
      receipt,
    };
  }

  async findPayments(invoiceId?: string) {
    return this.prisma.payment.findMany({
      where: invoiceId ? { invoiceId } : undefined,
      include: {
        invoice: {
          include: {
            student: true,
          },
        },
        receipts: true,
      },
      orderBy: { paidAt: 'desc' },
    });
  }

  // Arrears Report
  async getArrearsReport() {
    const invoices = await this.prisma.invoice.findMany({
      where: {
        OR: [
          { status: 'PENDING' },
          { status: 'PARTIAL' },
          { status: 'OVERDUE' },
        ],
      },
      include: {
        student: true,
        payments: true,
      },
    });

    return invoices.map((invoice) => {
      const totalPaid = invoice.payments.reduce(
        (sum, p) => sum + (p.amountLRD || 0),
        0,
      );
      const balance = invoice.amountLRD - totalPaid;

      return {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        student: invoice.student,
        amount: invoice.amountLRD,
        paid: totalPaid,
        balance,
        status: invoice.status,
        dueDate: invoice.dueDate,
      };
    });
  }
}
