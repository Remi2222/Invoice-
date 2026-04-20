import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { PdfService } from './pdf.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'invoice-secret-key-2024',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, PdfService, JwtStrategy],
})
export class InvoicesModule {}