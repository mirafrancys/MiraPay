import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectsService } from '../../app/services/projects.service';
import prisma from '../../app/prisma-client';

vi.mock('../../app/prisma-client', () => {
  return {
    default: {
      project: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ProjectsService();
  });

  describe('create', () => {
    it('should create project and convert dateDebut string to Date', async () => {
      const inputData = { clientId: 'client-1', nom: 'Project Alpha', dateDebut: '2026-06-09T00:00:00.000Z', typeFacturation: 'horaire' };
      const mockProject = { id: 'project-1', ...inputData, dateDebut: new Date(inputData.dateDebut) };
      vi.mocked(prisma.project.create).mockResolvedValue(mockProject as any);

      const result = await service.create(inputData as any);

      expect(prisma.project.create).toHaveBeenCalledWith({
        data: {
          ...inputData,
          dateDebut: new Date(inputData.dateDebut),
        },
      });
      expect(result).toEqual(mockProject);
    });

    it('should create project without converting dateDebut if dateDebut is missing or empty', async () => {
      const inputData = { clientId: 'client-1', nom: 'Project Alpha', dateDebut: '', typeFacturation: 'horaire' };
      const mockProject = { id: 'project-1', ...inputData, dateDebut: null };
      vi.mocked(prisma.project.create).mockResolvedValue(mockProject as any);

      const result = await service.create(inputData as any);

      expect(prisma.project.create).toHaveBeenCalledWith({
        data: {
          clientId: 'client-1',
          nom: 'Project Alpha',
          dateDebut: '',
          typeFacturation: 'horaire',
        },
      });
      expect(result).toEqual(mockProject);
    });
  });

  describe('findAll', () => {
    it('should return all non-archived projects', async () => {
      const mockProjects = [{ id: 'project-1', nom: 'Project 1', statut: 'brouillon' }];
      vi.mocked(prisma.project.findMany).mockResolvedValue(mockProjects as any);

      const result = await service.findAll();

      expect(prisma.project.findMany).toHaveBeenCalledWith({
        where: { statut: { not: 'archive' } },
        include: {
          client: { select: { nomLegal: true } },
          _count: { select: { tasks: true, timeEntries: true } },
        },
      });
      expect(result).toEqual(mockProjects);
    });
  });

  describe('findOne', () => {
    it('should return project by id with client, tasks, and timeEntries (limited to 50)', async () => {
      const mockProject = { id: 'project-1', nom: 'Project 1' };
      vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject as any);

      const result = await service.findOne('project-1');

      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: 'project-1' },
        include: {
          client: true,
          tasks: true,
          timeEntries: {
            take: 50,
            orderBy: { date: 'desc' },
            include: { user: { select: { username: true } } },
          },
        },
      });
      expect(result).toEqual(mockProject);
    });
  });

  describe('update', () => {
    it('should update and return project', async () => {
      const mockProject = { id: 'project-1', nom: 'Updated Name' };
      vi.mocked(prisma.project.update).mockResolvedValue(mockProject as any);

      const result = await service.update('project-1', { nom: 'Updated Name' });

      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: 'project-1' },
        data: { nom: 'Updated Name' },
      });
      expect(result).toEqual(mockProject);
    });
  });

  describe('remove', () => {
    it('should delete and return project', async () => {
      const mockProject = { id: 'project-1' };
      vi.mocked(prisma.project.delete).mockResolvedValue(mockProject as any);

      const result = await service.remove('project-1');

      expect(prisma.project.delete).toHaveBeenCalledWith({
        where: { id: 'project-1' },
      });
      expect(result).toEqual(mockProject);
    });
  });
});
