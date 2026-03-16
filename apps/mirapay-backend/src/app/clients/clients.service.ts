import prisma from '../prisma-client';
import { Client, Prisma } from '../../generated/prisma';

export class ClientsService {
  async create(data: Prisma.ClientCreateInput): Promise<Client> {
    return prisma.client.create({ data });
  }

  async findAll(): Promise<Client[]> {
    return prisma.client.findMany({
      where: { estArchive: false },
      include: {
        _count: {
          select: { projects: true, invoices: true }
        }
      }
    });
  }

  async findOne(id: string): Promise<Client | null> {
    return prisma.client.findUnique({
      where: { id },
      include: {
        projects: true,
        invoices: true,
        bankHours: true
      } as any
    });
  }

  async update(id: string, data: Prisma.ClientUpdateInput): Promise<Client> {
    return prisma.client.update({
      where: { id },
      data
    });
  }

  async remove(id: string): Promise<Client> {
    // Règle métier 2.4.1 : Interdit de supprimer si possède au moins un projet
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        _count: {
          select: { projects: true }
        }
      }
    });

    if (client && client._count.projects > 0) {
      throw new Error("Impossible de supprimer un client qui possède des projets. Veuillez l'archiver.");
    }

    return prisma.client.delete({
      where: { id }
    });
  }

  async archive(id: string): Promise<Client> {
    return prisma.client.update({
      where: { id },
      data: { estArchive: true }
    });
  }
}
