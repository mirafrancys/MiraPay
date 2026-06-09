import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsersService } from '../../app/services/users.service';
import prisma from '../../app/prisma-client';
import bcrypt from 'bcrypt';

vi.mock('../../app/prisma-client', () => {
  return {
    default: {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

vi.mock('bcrypt', () => {
  return {
    default: {
      hash: vi.fn().mockResolvedValue('hashed_password'),
    },
  };
});

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new UsersService();
  });

  describe('create', () => {
    const inputData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    it('should successfully create a user and hash password', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue({
        id: 'user-id-1',
        ...inputData,
        password: 'hashed_password',
        phoneNumber: null,
        dateOfBirth: null,
        address: null,
        city: null,
        country: null,
        isActive: true,
        roleId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(inputData);

      expect(prisma.user.findUnique).toHaveBeenCalledTimes(2);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...inputData,
          password: 'hashed_password',
        },
      });
      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe('user-id-1');
    });

    it('should throw an error if email already exists', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ id: 'existing-id' } as any);

      await expect(service.create(inputData)).rejects.toThrow('Email already exists');
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should throw an error if username already exists', async () => {
      vi.mocked(prisma.user.findUnique)
        .mockResolvedValueOnce(null) // for email
        .mockResolvedValueOnce({ id: 'existing-id' } as any); // for username

      await expect(service.create(inputData)).rejects.toThrow('Username already exists');
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return list of users with transaction count', async () => {
      const mockUsers = [
        { id: '1', username: 'user1', email: 'user1@test.com' },
        { id: '2', username: 'user2', email: 'user2@test.com' },
      ];
      vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any);

      const result = await service.findAll();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        include: {
          _count: {
            select: { transactions: true },
          },
        },
      });
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by id with transactions', async () => {
      const mockUser = { id: '1', username: 'user1', email: 'user1@test.com', transactions: [] };
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

      const result = await service.findOne('1');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          transactions: true,
        },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update and return user', async () => {
      const mockUser = { id: '1', username: 'updateduser' };
      vi.mocked(prisma.user.update).mockResolvedValue(mockUser as any);

      const result = await service.update('1', { username: 'updateduser' });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { username: 'updateduser' },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('remove', () => {
    it('should delete and return user', async () => {
      const mockUser = { id: '1', username: 'deleteduser' };
      vi.mocked(prisma.user.delete).mockResolvedValue(mockUser as any);

      const result = await service.remove('1');

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockUser);
    });
  });
});
