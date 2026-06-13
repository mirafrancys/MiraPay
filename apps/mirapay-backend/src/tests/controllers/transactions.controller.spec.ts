import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TransactionsController } from '../../app/controllers/transactions.controller';
//import { TransactionsService } from '../../app/services/transactions.service';
import { Request, Response } from 'express';

type MockedService = Record<string, ReturnType<typeof vi.fn>>;

// Mock the service
vi.mock('../../app/services/transactions.service', () => {
  const mockInstance = {
    getAllTransactions: vi.fn(),
    getTransactionById: vi.fn(),
    createTransaction: vi.fn(),
    updateTransactionStatus: vi.fn(),
    deleteTransaction: vi.fn(),
  };
  (global as typeof globalThis & { mockTransactionsServiceInstance: MockedService }).mockTransactionsServiceInstance = mockInstance;

  return {
    TransactionsService: vi.fn().mockImplementation(function () {
      return mockInstance;
    }),
  };
});

describe('TransactionsController', () => {
  let controller: TransactionsController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new TransactionsController();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return 200 and transactions', async () => {
      const mockTransactions = [{ id: '1', amount: 100 }];
      
      const mockService = (global as typeof globalThis & { mockTransactionsServiceInstance: MockedService }).mockTransactionsServiceInstance;
      mockService.getAllTransactions.mockResolvedValue(mockTransactions);

      const req = {} as unknown as Request;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.getAll(req, res);

      expect(res.json).toHaveBeenCalledWith(mockTransactions);
    });

    it('should throw error if service fails', async () => {
      const mockService = (global as typeof globalThis & { mockTransactionsServiceInstance: MockedService }).mockTransactionsServiceInstance;
      mockService.getAllTransactions.mockRejectedValue(new Error('Internal Error'));

      const req = {} as unknown as Request;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as unknown as Response;

      await expect(controller.getAll(req, res)).rejects.toThrow('Internal Error');
    });
  });
});

