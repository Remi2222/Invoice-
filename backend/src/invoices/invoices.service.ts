import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
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
export class InvoicesService {
  async create(userId: string, data: {
    clientId: string;
    items: { description: string; quantity: number; unitPrice: number }[];
    dueDate?: string;
    invoiceDate?: string;
    poNumber?: string;
    paymentTerms?: string;
    currency?: string;
    logo?: string;
  }) {
    const total = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const count = await prisma.invoice.count({ where: { userId } });
    const number = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    return prisma.invoice.create({
      data: {
        number,
        userId,
        clientId: data.clientId,
        total,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : null,
        poNumber: data.poNumber || null,
        paymentTerms: data.paymentTerms || null,
        currency: data.currency || 'MAD',
        logo: data.logo || null,
        items: {
          create: data.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
          })),
        },
      },
      include: { items: true, client: true },
    });
  }

  async update(userId: string, id: string, data: {
    clientId?: string;
    items?: { description: string; quantity: number; unitPrice: number }[];
    dueDate?: string;
    invoiceDate?: string;
    poNumber?: string;
    paymentTerms?: string;
    currency?: string;
    logo?: string;
  }) {
    // Vérifier que la facture appartient à l'utilisateur
    const existingInvoice = await prisma.invoice.findFirst({
      where: { id, userId },
      include: { items: true }
    });

    if (!existingInvoice) {
      throw new Error('Invoice not found');
    }

    // Calculer le nouveau total si les items sont fournis
    let total = existingInvoice.total;
    if (data.items) {
      total = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    }

    // Supprimer les anciens items si de nouveaux sont fournis
    if (data.items) {
      await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
    }

    return prisma.invoice.update({
      where: { id },
      data: {
        ...(data.clientId && { clientId: data.clientId }),
        ...(data.dueDate && { dueDate: data.dueDate ? new Date(data.dueDate) : null }),
        ...(data.invoiceDate && { invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : null }),
        ...(data.poNumber !== undefined && { poNumber: data.poNumber }),
        ...(data.paymentTerms !== undefined && { paymentTerms: data.paymentTerms }),
        ...(data.currency && { currency: data.currency }),
        ...(data.logo !== undefined && { logo: data.logo }),
        ...(data.items && {
          total,
          items: {
            create: data.items.map(item => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.quantity * item.unitPrice,
            })),
          },
        }),
      },
      include: { items: true, client: true },
    });
  }

  async findAll(userId: string) {
    return prisma.invoice.findMany({
      where: { userId },
      include: { client: true, items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    return prisma.invoice.findFirst({
      where: { id, userId },
      include: { items: true, client: true },
    });
  }

  async updateStatus(userId: string, id: string, status: 'PAID' | 'UNPAID' | 'PENDING') {
    return prisma.invoice.update({
      where: { id },
      data: { status },
    });
  }

  async remove(userId: string, id: string) {
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
    return prisma.invoice.delete({ where: { id } });
  }
}