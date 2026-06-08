import prisma from '../prisma-client';
import { Task, Prisma, PrismaClient } from '../../generated/prisma';

export class TasksService {
  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    const formattedData = { ...data };
    
    if (formattedData.dateDebutPrevue && String(formattedData.dateDebutPrevue).trim() !== '') {
      formattedData.dateDebutPrevue = new Date(formattedData.dateDebutPrevue as string);
    } else {
      delete formattedData.dateDebutPrevue;
    }

    if (formattedData.dateEcheance && String(formattedData.dateEcheance).trim() !== '') {
      formattedData.dateEcheance = new Date(formattedData.dateEcheance as string);
    } else {
      delete formattedData.dateEcheance;
    }

    return prisma.task.create({ data: formattedData });
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

  async addNote(data: Prisma.TaskNoteCreateInput) {
    return (prisma as PrismaClient).taskNote.create({ data });
  }

  async findNotesByTask(tacheId: string) {
    return (prisma as PrismaClient).taskNote.findMany({
      where: { tacheId },
      include: {
        user: { select: { firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
