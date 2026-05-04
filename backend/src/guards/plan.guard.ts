import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

@Injectable()
export class PlanGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;

    if (!userId) throw new ForbiddenException('Non autorisé');

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.plan === 'FREE') {
      const count = await prisma.invoice.count({ where: { userId } });
      if (count >= 5) {
        throw new ForbiddenException('Limite atteinte — Passez au plan Pro pour continuer');
      }
    }

    return true;
  }
}