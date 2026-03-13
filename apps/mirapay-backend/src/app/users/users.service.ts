import prisma from '../prisma-client';
import { User, Prisma } from '@prisma/client';

export class UsersService {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new Error('Email already exists');
    }

    return prisma.user.create({
      data,
    });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany({
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    });
  }

  async findOne(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        transactions: true
      }
    });
    return user;
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}
