import prisma from '../prisma-client';
import { Task, Prisma } from '../generated/prisma';

export class TasksService {
  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    return prisma.task.create({ data });
  }

  async findAllByProject(projectId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: { projetId: projectId },
      include: {
        _count: { select: { timeEntries: true } }
      }
    });
  }

  async findOne(id: string): Promise<Task | null> {
    return prisma.task.findUnique({
      where: { id },
      include: {
        projet: { select: { nom: true } }
      }
    });
  }

  async update(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data
    });
  }

  async remove(id: string): Promise<Task> {
    return prisma.task.delete({
      where: { id }
    });
  }
}
