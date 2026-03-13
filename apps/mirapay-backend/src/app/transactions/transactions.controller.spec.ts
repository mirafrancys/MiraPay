import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

// Mock the service
vi.mock('./transactions.service', () => {
  return {
    TransactionsService: vi.fn().mockImplementation(() => {
      return {
        getAllTransactions: vi.fn(),
        getTransactionById: vi.fn(),
        createTransaction: vi.fn(),
        updateTransactionStatus: vi.fn(),
        deleteTransaction: vi.fn(),
      };
    }),
  };
});

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let mockService: any;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new TransactionsController();
    // In our implementation, we create a new instance of the service inside the controller file
    // But since we vi.mock'ed it, we can access the mock instance if we need to.
    // For simplicity, let's assume the controller uses the mocked service.
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return 200 and transactions', async () => {
      const mockTransactions = [{ id: '1', amount: 100 }];
      
      // We need to mock the implementation of the service method
      // Since the service is instantiated inside the controller file, we rely on the mock
      const { TransactionsService } = await import('./transactions.service');
      const serviceInstance = new TransactionsService();
      (serviceInstance.getAllTransactions as any).mockResolvedValue(mockTransactions);

      const req = {} as any;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as any;

      // In the real code, we use a singleton exported from the controller file
      // but for tests we can test the class methods
      await controller.getAll(req, res);

      expect(res.json).toHaveBeenCalledWith(mockTransactions);
    });

    it('should return 500 if service fails', async () => {
      const { TransactionsService } = await import('./transactions.service');
      const serviceInstance = new TransactionsService();
      (serviceInstance.getAllTransactions as any).mockRejectedValue(new Error('Internal Error'));

      const req = {} as any;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as any;

      await controller.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch transactions' });
    });
  });
});
