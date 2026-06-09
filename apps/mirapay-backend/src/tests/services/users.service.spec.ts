import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsersService } from '../../app/services/users.service';
import prisma from '../../app/prisma-client';
import bcrypt from 'bcrypt';
import { User, Role } from '@prisma/client';

vi.mock('../../app/prisma-client', () => {
  return {
    default: {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
      },
      role: {
        findUnique: vi.fn(),
        create: vi.fn(),
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

    it('should successfully create the first user as ADMIN and create roles if missing', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.role.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.role.create)
        .mockResolvedValueOnce({ id: 'admin-role-id', name: 'ADMIN', description: 'Administrator Role', createdAt: new Date(), updatedAt: new Date() } as unknown as Role)
        .mockResolvedValueOnce({ id: 'user-role-id', name: 'USER', description: 'Standard User Role', createdAt: new Date(), updatedAt: new Date() } as unknown as Role);
      vi.mocked(prisma.user.count).mockResolvedValue(0);

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
        roleId: 'admin-role-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(inputData);

      expect(prisma.user.findUnique).toHaveBeenCalledTimes(2);
      expect(prisma.role.findUnique).toHaveBeenCalledTimes(2);
      expect(prisma.role.create).toHaveBeenCalledTimes(2);
      expect(prisma.user.count).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...inputData,
          password: 'hashed_password',
          role: { connect: { id: 'admin-role-id' } },
        },
      });
      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe('user-id-1');
    });

    it('should successfully create subsequent users as USER and use existing roles', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.role.findUnique)
        .mockResolvedValueOnce({ id: 'admin-role-id', name: 'ADMIN', description: 'Administrator Role', createdAt: new Date(), updatedAt: new Date() } as unknown as Role)
        .mockResolvedValueOnce({ id: 'user-role-id', name: 'USER', description: 'Standard User Role', createdAt: new Date(), updatedAt: new Date() } as unknown as Role);
      vi.mocked(prisma.user.count).mockResolvedValue(1);

      vi.mocked(prisma.user.create).mockResolvedValue({
        id: 'user-id-2',
        ...inputData,
        password: 'hashed_password',
        phoneNumber: null,
        dateOfBirth: null,
        address: null,
        city: null,
        country: null,
        isActive: true,
        roleId: 'user-role-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(inputData);

      expect(prisma.user.findUnique).toHaveBeenCalledTimes(2);
      expect(prisma.role.findUnique).toHaveBeenCalledTimes(2);
      expect(prisma.role.create).not.toHaveBeenCalled();
      expect(prisma.user.count).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...inputData,
          password: 'hashed_password',
          role: { connect: { id: 'user-role-id' } },
        },
      });
      expect(result.id).toBe('user-id-2');
    });

    it('should successfully create a user with a specific role if role is provided', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const customRoleInput = {
        ...inputData,
        role: { connect: { id: 'custom-role-id' } },
      };

      vi.mocked(prisma.user.create).mockResolvedValue({
        id: 'user-id-3',
        ...inputData,
        password: 'hashed_password',
        phoneNumber: null,
        dateOfBirth: null,
        address: null,
        city: null,
        country: null,
        isActive: true,
        roleId: 'custom-role-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(customRoleInput);

      expect(prisma.user.findUnique).toHaveBeenCalledTimes(2);
      expect(prisma.role.findUnique).not.toHaveBeenCalled();
      expect(prisma.role.create).not.toHaveBeenCalled();
      expect(prisma.user.count).not.toHaveBeenCalled();
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...inputData,
          password: 'hashed_password',
          role: { connect: { id: 'custom-role-id' } },
        },
      });
      expect(result.id).toBe('user-id-3');
    });

    it('should throw an error if email already exists', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ id: 'existing-id' } as unknown as User);

      await expect(service.create(inputData)).rejects.toThrow('Email already exists');
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should throw an error if username already exists', async () => {
      vi.mocked(prisma.user.findUnique)
        .mockResolvedValueOnce(null) // for email
        .mockResolvedValueOnce({ id: 'existing-id' } as unknown as User); // for username

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
