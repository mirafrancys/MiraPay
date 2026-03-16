import prisma from '../prisma-client';

export class BankHoursService {
  async create(data: any): Promise<any> {
    return (prisma as any).bankHour.create({ data });
  }

  async findAllByClient(clientId: string): Promise<any[]> {
    return (prisma as any).bankHour.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findAllByProject(projectId: string): Promise<any[]> {
    return (prisma as any).bankHour.findMany({
      where: { projetId: projectId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
