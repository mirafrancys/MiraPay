import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClientsService } from '../../app/services/clients.service';
import prisma from '../../app/prisma-client';

vi.mock('../../app/prisma-client', () => {
  return {
    default: {
      client: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

describe('ClientsService', () => {
  let service: ClientsService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ClientsService();
  });

  describe('create', () => {
    it('should create a client', async () => {
      const inputData = { nomLegal: 'Acme Corp', typeClient: 'entreprise', adresseLigne1: '123 St', ville: 'Montreal', province: 'QC', codePostal: 'H0H0H0', pays: 'Canada', courriel: 'acme@test.com', telephone: '123', modeFacturationParDefaut: 'horaire' };
      const mockClient = { id: 'client-1', ...inputData };
      vi.mocked(prisma.client.create).mockResolvedValue(mockClient as any);

      const result = await service.create(inputData);

      expect(prisma.client.create).toHaveBeenCalledWith({
        data: inputData,
      });
      expect(result).toEqual(mockClient);
    });
  });

  describe('findAll', () => {
    it('should return all non-archived clients with project and invoice count', async () => {
      const mockClients = [{ id: 'client-1', nomLegal: 'Client 1', estArchive: false }];
      vi.mocked(prisma.client.findMany).mockResolvedValue(mockClients as any);

      const result = await service.findAll();

      expect(prisma.client.findMany).toHaveBeenCalledWith({
        where: { estArchive: false },
        include: {
          _count: {
            select: { projects: true, invoices: true },
          },
        },
      });
      expect(result).toEqual(mockClients);
    });
  });

  describe('findOne', () => {
    it('should return client by id with associated entities', async () => {
      const mockClient = { id: 'client-1', nomLegal: 'Client 1' };
      vi.mocked(prisma.client.findUnique).mockResolvedValue(mockClient as any);

      const result = await service.findOne('client-1');

      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { id: 'client-1' },
        include: {
          projects: true,
          invoices: true,
          bankHours: true,
          contacts: true,
        } as any,
      });
      expect(result).toEqual(mockClient);
    });
  });

  describe('update', () => {
    it('should update and return client', async () => {
      const mockClient = { id: 'client-1', nomLegal: 'Updated Name' };
      vi.mocked(prisma.client.update).mockResolvedValue(mockClient as any);

      const result = await service.update('client-1', { nomLegal: 'Updated Name' });

      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: 'client-1' },
        data: { nomLegal: 'Updated Name' },
      });
      expect(result).toEqual(mockClient);
    });
  });

  describe('archive', () => {
    it('should set estArchive to true and return client', async () => {
      const mockClient = { id: 'client-1', estArchive: true };
      vi.mocked(prisma.client.update).mockResolvedValue(mockClient as any);

      const result = await service.archive('client-1');

      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: 'client-1' },
        data: { estArchive: true },
      });
      expect(result).toEqual(mockClient);
    });
  });

  describe('remove', () => {
    it('should successfully delete client if client has zero projects', async () => {
      const mockClient = { id: 'client-1', _count: { projects: 0 } };
      vi.mocked(prisma.client.findUnique).mockResolvedValue(mockClient as any);
      vi.mocked(prisma.client.delete).mockResolvedValue({ id: 'client-1' } as any);

      const result = await service.remove('client-1');

      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { id: 'client-1' },
        include: {
          _count: {
            select: { projects: true },
          },
        },
      });
      expect(prisma.client.delete).toHaveBeenCalledWith({
        where: { id: 'client-1' },
      });
      expect(result).toEqual({ id: 'client-1' });
    });

    it('should throw an error and not delete if client has projects', async () => {
      const mockClient = { id: 'client-1', _count: { projects: 1 } };
      vi.mocked(prisma.client.findUnique).mockResolvedValue(mockClient as any);

      await expect(service.remove('client-1')).rejects.toThrow(
        "Impossible de supprimer un client qui possède des projets. Veuillez l'archiver."
      );
      expect(prisma.client.delete).not.toHaveBeenCalled();
    });
  });
});
