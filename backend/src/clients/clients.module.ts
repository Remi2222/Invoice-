import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
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
  controllers: [ClientsController],
  providers: [ClientsService, JwtStrategy],
})
export class ClientsModule {}