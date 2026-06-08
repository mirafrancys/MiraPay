import prisma from '../prisma-client';
import { TimeEntry, Prisma } from '../../generated/prisma';

export class TimeEntriesService {
  async create(data: Prisma.TimeEntryUncheckedCreateInput): Promise<TimeEntry> {
    return prisma.timeEntry.create({ data });
  }

  async findAll(filters: {
    projetId?: string;
    userId?: string;
    statut?: string;
    estFacturable?: boolean;
    dateDebut?: string;
    dateFin?: string;
  }): Promise<TimeEntry[]> {
    const where: any = {};

    if (filters.projetId) where.projetId = filters.projetId;
    if (filters.userId) where.userId = filters.userId;
    if (filters.statut) where.statut = filters.statut;
    if (filters.estFacturable !== undefined) {
      where.estFacturable = filters.estFacturable;
    }
    
    if (filters.dateDebut || filters.dateFin) {
      where.date = {};
      if (filters.dateDebut) where.date.gte = new Date(filters.dateDebut);
      if (filters.dateFin) where.date.lte = new Date(filters.dateFin);
    }

    return prisma.timeEntry.findMany({
      where,
      include: {
        projet: { select: { nom: true } },
        tache: { select: { titre: true } },
        user: { select: { username: true } }
      },
      orderBy: { date: 'desc' }
    });
  }

  async findOne(id: string): Promise<TimeEntry | null> {
    return prisma.timeEntry.findUnique({
      where: { id }
    });
  }

  async update(id: string, data: Prisma.TimeEntryUncheckedUpdateInput): Promise<TimeEntry> {
    // Règle métier 5.2.1 : Ne peut plus être modifiée si au statut facture
    const entry = await prisma.timeEntry.findUnique({ where: { id } });
    if (entry && entry.statut === 'facture') {
      throw new Error("Une entrée de temps au statut 'facture' ne peut plus être modifiée.");
    }

    return prisma.timeEntry.update({
      where: { id },
      data
    });
  }

  async approve(id: string): Promise<TimeEntry> {
    return this.update(id, { statut: 'approuve' });
  }

  async remove(id: string): Promise<TimeEntry> {
    const entry = await prisma.timeEntry.findUnique({ where: { id } });
    if (entry && entry.statut === 'facture') {
      throw new Error("Une entrée de temps au statut 'facture' ne peut plus être supprimée.");
    }

    return prisma.timeEntry.delete({ where: { id } });
  }
}
