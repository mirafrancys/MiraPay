import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';

// Mock the service
vi.mock('../services/users.service', () => {
  return {
    UsersService: vi.fn().mockImplementation(function () {
      return {
        findAll: vi.fn(),
        findOne: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
      };
    }),
  };
});

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new UsersController();
  });

  describe('getAll', () => {
    it('should return users', async () => {
      const mockUsers = [{ id: '1', email: 'test@test.com' }];
      const { UsersService } = await import('../services/users.service');
      const serviceInstance = new UsersService();
      (serviceInstance.findAll as any).mockResolvedValue(mockUsers);

      const req = {} as any;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as any;

      await controller.getAll(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors', async () => {
      const { UsersService } = await import('../services/users.service');
      const serviceInstance = new UsersService();
      (serviceInstance.findAll as any).mockRejectedValue(new Error('DB Error'));

      const req = {} as any;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as any;

      await controller.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
    });
  });
});

