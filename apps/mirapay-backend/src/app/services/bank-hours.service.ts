import prisma from '../prisma-client';

export class BankHoursService {
  async create(data: any): Promise<any> {
    const formattedData = { ...data };
    
    if (formattedData.dateDebut && String(formattedData.dateDebut).trim() !== '') {
      formattedData.dateDebut = new Date(formattedData.dateDebut);
    } else {
      delete formattedData.dateDebut;
    }

    if (formattedData.dateFin && String(formattedData.dateFin).trim() !== '') {
      formattedData.dateFin = new Date(formattedData.dateFin);
    } else {
      delete formattedData.dateFin;
    }

    return (prisma as any).bankHour.create({ data: formattedData });
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
