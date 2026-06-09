import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TransactionsService } from '../../app/services/transactions.service';
import prisma from '../../app/prisma-client';

vi.mock('../../app/prisma-client', () => {
  return {
    default: {
      transaction: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new TransactionsService();
  });

  describe('getAllTransactions', () => {
    it('should return transactions ordered by createdAt desc with user select details', async () => {
      const mockTransactions = [
        { id: 'tx-1', amount: 100, user: { username: 'test1', email: 'test1@test.com' } },
      ];
      vi.mocked(prisma.transaction.findMany).mockResolvedValue(mockTransactions as any);

      const result = await service.getAllTransactions();

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        include: {
          user: {
            select: {
              username: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toEqual(mockTransactions);
    });
  });

  describe('getTransactionById', () => {
    it('should return transaction by id with user details', async () => {
      const mockTransaction = { id: 'tx-1', amount: 100, user: { id: 'user-1' } };
      vi.mocked(prisma.transaction.findUnique).mockResolvedValue(mockTransaction as any);

      const result = await service.getTransactionById('tx-1');

      expect(prisma.transaction.findUnique).toHaveBeenCalledWith({
        where: { id: 'tx-1' },
        include: {
          user: true,
        },
      });
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('createTransaction', () => {
    it('should create and return transaction', async () => {
      const inputData = { amount: 150, currency: 'CAD', userId: 'user-1', status: 'PENDING' };
      const mockTransaction = { id: 'tx-1', ...inputData };
      vi.mocked(prisma.transaction.create).mockResolvedValue(mockTransaction as any);

      const result = await service.createTransaction(inputData);

      expect(prisma.transaction.create).toHaveBeenCalledWith({
        data: inputData,
      });
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('updateTransactionStatus', () => {
    it('should update and return transaction status', async () => {
      const mockTransaction = { id: 'tx-1', status: 'COMPLETED' };
      vi.mocked(prisma.transaction.update).mockResolvedValue(mockTransaction as any);

      const result = await service.updateTransactionStatus('tx-1', 'COMPLETED');

      expect(prisma.transaction.update).toHaveBeenCalledWith({
        where: { id: 'tx-1' },
        data: { status: 'COMPLETED' },
      });
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('deleteTransaction', () => {
    it('should delete and return transaction', async () => {
      const mockTransaction = { id: 'tx-1' };
      vi.mocked(prisma.transaction.delete).mockResolvedValue(mockTransaction as any);

      const result = await service.deleteTransaction('tx-1');

      expect(prisma.transaction.delete).toHaveBeenCalledWith({
        where: { id: 'tx-1' },
      });
      expect(result).toEqual(mockTransaction);
    });
  });
});
