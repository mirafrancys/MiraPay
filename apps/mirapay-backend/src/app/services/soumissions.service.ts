import prisma from '../prisma-client';

export class SoumissionsService {
  async create(data: any): Promise<any> {
    const { lines, ...soumissionData } = data;
    return (prisma as any).soumission.create({
      data: {
        ...soumissionData,
        lines: lines ? { create: lines } : undefined
      },
      include: { lines: true }
    });
  }

  async findAll(): Promise<any[]> {
    return (prisma as any).soumission.findMany({
      include: { client: true, lines: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string): Promise<any> {
    return (prisma as any).soumission.findUnique({
      where: { id },
      include: { client: true, lines: true, contact: true }
    });
  }

  async update(id: string, data: any): Promise<any> {
    const { lines, ...soumissionData } = data;
    // Pour simplifier, on écrase les lignes si passées
    if (lines) {
      await (prisma as any).soumissionLine.deleteMany({
        where: { soumissionId: id }
      });
    }

    return (prisma as any).soumission.update({
      where: { id },
      data: {
        ...soumissionData,
        lines: lines ? { create: lines } : undefined
      },
      include: { lines: true }
    });
  }
}
