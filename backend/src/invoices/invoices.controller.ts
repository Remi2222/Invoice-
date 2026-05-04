import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards, Res } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { PdfService } from './pdf.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Response } from 'express';
import { PlanGuard } from '../guards/plan.guard';
@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(
    private invoicesService: InvoicesService,
    private pdfService: PdfService,
  ) {}

  @Post()
  @UseGuards(PlanGuard)
  create(@Request() req, @Body() dto: any) {
    return this.invoicesService.create(req.user.sub, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.invoicesService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.invoicesService.findOne(req.user.sub, id);
  }
@Get(':id/pdf')
async downloadPdf(@Request() req, @Param('id') id: string, @Res() res: Response) {
  const invoice = await this.invoicesService.findOne(req.user.sub, id);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
  const pdf = await this.pdfService.generateInvoicePdf(invoice);
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${invoice.number}.pdf"`,
  });
  res.send(pdf);
}

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: any) {
    return this.invoicesService.update(req.user.sub, id, dto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.invoicesService.remove(req.user.sub, id);
  }
}