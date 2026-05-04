import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

setInterval(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {}
}, 60000);

@Injectable()
export class ClientsService {
  async create(userId: string, data: { name: string; email?: string; phone?: string; address?: string }) {
    return prisma.client.create({
      data: { ...data, userId },
    });
  }

  async findAll(userId: string) {
    return prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    return prisma.client.findFirst({
      where: { id, userId },
    });
  }

  async update(userId: string, id: string, data: { name?: string; email?: string; phone?: string; address?: string }) {
    return prisma.client.update({
      where: { id },
      data,
    });
  }

  async remove(userId: string, id: string) {
    return prisma.client.delete({
      where: { id },
    });
  }
}