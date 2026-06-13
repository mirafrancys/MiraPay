import prisma from '../prisma-client';
import { User, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { HttpError } from '../utils/http-error';

export class UsersService {
  async create(data: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      throw new HttpError(409, 'Email already exists');
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUsername) {
      throw new HttpError(409, 'Username already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    let roleData = data.role;
    if (!roleData) {
      let adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
      if (!adminRole) {
        adminRole = await prisma.role.create({
          data: { name: 'ADMIN', description: 'Administrator Role' },
        });
      }

      let userRole = await prisma.role.findUnique({ where: { name: 'USER' } });
      if (!userRole) {
        userRole = await prisma.role.create({
          data: { name: 'USER', description: 'Standard User Role' },
        });
      }

      const userCount = await prisma.user.count();
      const targetRoleId = userCount === 0 ? adminRole.id : userRole.id;
      roleData = { connect: { id: targetRoleId } };
    }

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: roleData,
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
