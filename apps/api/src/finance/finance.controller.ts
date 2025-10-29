import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('finance')
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  @Post('fee-schedules')
  @ApiOperation({ summary: 'Create fee schedule' })
  createFeeSchedule(@Body() data: any) {
    return this.financeService.createFeeSchedule(data);
  }

  @Get('fee-schedules')
  @ApiOperation({ summary: 'List fee schedules' })
  findAllFeeSchedules() {
    return this.financeService.findAllFeeSchedules();
  }

  @Post('invoices')
  @ApiOperation({ summary: 'Create invoice' })
  createInvoice(@Body() data: any) {
    return this.financeService.createInvoice(data);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'List invoices' })
  findAllInvoices(@Query('studentId') studentId?: string) {
    return this.financeService.findAllInvoices(studentId);
  }

  @Get('invoices/:id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  findOneInvoice(@Param('id') id: string) {
    return this.financeService.findOneInvoice(id);
  }

  @Post('payments')
  @ApiOperation({ summary: 'Record payment' })
  recordPayment(@Body() data: any) {
    return this.financeService.recordPayment(data);
  }

  @Get('students/:studentId/balance')
  @ApiOperation({ summary: 'Get student balance' })
  getStudentBalance(@Param('studentId') studentId: string) {
    return this.financeService.getStudentBalance(studentId);
  }

  @Get('reports/arrears')
  @ApiOperation({ summary: 'Get arrears report' })
  getArrearsReport() {
    return this.financeService.getArrearsReport();
  }
}
