import prisma from '../prisma-client';
import { Contact, Prisma } from '@mirapay/prisma';

export class ContactsService {
  async create(data: Prisma.ContactCreateInput): Promise<Contact> {
    return prisma.contact.create({ data });
  }

  async findAllByClient(clientId: string): Promise<Contact[]> {
    return prisma.contact.findMany({
      where: { clientId },
      orderBy: { nom: 'asc' }
    });
  }

  async archive(id: string): Promise<Contact> {
    return prisma.contact.update({
      where: { id },
      data: { estActive: false }
    });
  }
}
