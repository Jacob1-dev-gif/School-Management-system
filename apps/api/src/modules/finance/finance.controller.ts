import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  createFeeSchema,
  createInvoiceSchema,
  createPaymentSchema,
} from '@school/shared';

@ApiTags('finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('finance')
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  // Fees
  @Post('fees')
  @Roles('ADMIN', 'PRINCIPAL', 'ACCOUNTANT')
  @ApiOperation({ summary: 'Create fee' })
  createFee(@Body() body: any) {
    const data = createFeeSchema.parse(body);
    return this.financeService.createFee(data);
  }

  @Get('fees')
  @Roles('ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'PARENT')
  @ApiOperation({ summary: 'Get all fees' })
  findAllFees(@Query('academicYearId') academicYearId?: string) {
    return this.financeService.findAllFees(academicYearId);
  }

  // Fee Schedules
  @Post('fee-schedules')
  @Roles('ADMIN', 'PRINCIPAL', 'ACCOUNTANT')
  @ApiOperation({ summary: 'Create fee schedule' })
  createFeeSchedule(@Body() body: any) {
    return this.financeService.createFeeSchedule(body);
  }

  // Invoices
  @Post('invoices')
  @Roles('ADMIN', 'PRINCIPAL', 'ACCOUNTANT')
  @ApiOperation({ summary: 'Create invoice' })
  createInvoice(@Body() body: any) {
    const data = createInvoiceSchema.parse(body);
    return this.financeService.createInvoice(data);
  }

  @Get('invoices')
  @Roles('ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'PARENT')
  @ApiOperation({ summary: 'Get invoices' })
  findInvoices(@Query('studentId') studentId?: string) {
    return this.financeService.findInvoices(studentId);
  }

  // Payments
  @Post('payments')
  @Roles('ADMIN', 'PRINCIPAL', 'ACCOUNTANT')
  @ApiOperation({ summary: 'Record payment' })
  createPayment(@Body() body: any) {
    const data = createPaymentSchema.parse(body);
    return this.financeService.createPayment(data);
  }

  @Get('payments')
  @Roles('ADMIN', 'PRINCIPAL', 'ACCOUNTANT')
  @ApiOperation({ summary: 'Get payments' })
  findPayments(@Query('invoiceId') invoiceId?: string) {
    return this.financeService.findPayments(invoiceId);
  }

  // Reports
  @Get('reports/arrears')
  @Roles('ADMIN', 'PRINCIPAL', 'ACCOUNTANT')
  @ApiOperation({ summary: 'Get arrears report' })
  getArrearsReport() {
    return this.financeService.getArrearsReport();
  }
}
