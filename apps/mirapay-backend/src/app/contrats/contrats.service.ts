import prisma from '../prisma-client';

export class ContratsService {
  async create(data: any): Promise<any> {
    return (prisma as any).contrat.create({
      data,
      include: { client: true }
    });
  }

  async findAll(): Promise<any[]> {
    return (prisma as any).contrat.findMany({
      include: { client: true, projects: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string): Promise<any> {
    return (prisma as any).contrat.findUnique({
      where: { id },
      include: { client: true, projects: true, contact: true }
    });
  }

  async update(id: string, data: any): Promise<any> {
    return (prisma as any).contrat.update({
      where: { id },
      data,
      include: { client: true }
    });
  }
}
