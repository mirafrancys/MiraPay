import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsersController } from '../../app/controllers/users.controller';
//import { UsersService } from '../../app/services/users.service';
import { Request, Response } from 'express';

type MockedService = Record<string, ReturnType<typeof vi.fn>>;

// Mock the service
vi.mock('../../app/services/users.service', () => {
  const mockInstance = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };
  (global as typeof globalThis & { mockUsersServiceInstance: MockedService }).mockUsersServiceInstance = mockInstance;

  return {
    UsersService: vi.fn().mockImplementation(function () {
      return mockInstance;
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
      const mockService = (global as typeof globalThis & { mockUsersServiceInstance: MockedService }).mockUsersServiceInstance;
      mockService.findAll.mockResolvedValue(mockUsers);

      const req = {} as unknown as Request;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.getAll(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors', async () => {
      const mockService = (global as typeof globalThis & { mockUsersServiceInstance: MockedService }).mockUsersServiceInstance;
      mockService.findAll.mockRejectedValue(new Error('DB Error'));

      const req = {} as unknown as Request;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
    });
  });
});

