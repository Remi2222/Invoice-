import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

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
export class UsersService {
  async create(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: { email, password: hashed },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }
}