import prisma from '../prisma-client';
import { Project, Prisma } from '../generated/prisma';

export class ProjectsService {
  async create(data: Prisma.ProjectCreateInput): Promise<Project> {
    return prisma.project.create({ data });
  }

  async findAll(): Promise<Project[]> {
    return prisma.project.findMany({
      where: { statut: { not: 'archive' } },
      include: {
        client: { select: { nomLegal: true } },
        _count: { select: { tasks: true, timeEntries: true } }
      }
    });
  }

  async findOne(id: string): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        tasks: true,
        timeEntries: {
          take: 50,
          orderBy: { date: 'desc' },
          include: { user: { select: { username: true } } }
        }
      }
    });
  }

  async update(id: string, data: Prisma.ProjectUpdateInput): Promise<Project> {
    return prisma.project.update({
      where: { id },
      data
    });
  }

  async remove(id: string): Promise<Project> {
    return prisma.project.delete({
      where: { id }
    });
  }
}
