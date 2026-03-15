import prisma from '../prisma-client';
import { User, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

export class UsersService {
  async create(data: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUsername) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany({
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });
  }

  async findOne(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        transactions: true,
      },
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
