import prisma from '../prisma-client';
import { Transaction } from '@prisma/client';

export class TransactionsService {
  async getAllTransactions(): Promise<Transaction[]> {
    return prisma.transaction.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return prisma.transaction.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async createTransaction(data: {
    amount: number;
    currency: string;
    userId: string;
    status: string;
  }): Promise<Transaction> {
    return prisma.transaction.create({
      data,
    });
  }

  async updateTransactionStatus(id: string, status: string): Promise<Transaction> {
    return prisma.transaction.update({
      where: { id },
      data: { status },
    });
  }

  async deleteTransaction(id: string): Promise<Transaction> {
    return prisma.transaction.delete({
      where: { id },
    });
  }
}
