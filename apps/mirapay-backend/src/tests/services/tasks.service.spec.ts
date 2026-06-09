import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TasksService } from '../../app/services/tasks.service';
import prisma from '../../app/prisma-client';

vi.mock('../../app/prisma-client', () => {
  return {
    default: {
      task: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      taskNote: {
        create: vi.fn(),
        findMany: vi.fn(),
      },
    },
  };
});

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new TasksService();
  });

  describe('create', () => {
    it('should create task and format date inputs', async () => {
      const inputData = { projetId: 'project-1', titre: 'Task 1', type: 'analyse', dateDebutPrevue: '2026-06-09T00:00:00.000Z', dateEcheance: '2026-06-15T00:00:00.000Z' };
      const mockTask = { id: 'task-1', ...inputData, dateDebutPrevue: new Date(inputData.dateDebutPrevue), dateEcheance: new Date(inputData.dateEcheance) };
      vi.mocked(prisma.task.create).mockResolvedValue(mockTask as any);

      const result = await service.create(inputData as any);

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          ...inputData,
          dateDebutPrevue: new Date(inputData.dateDebutPrevue),
          dateEcheance: new Date(inputData.dateEcheance),
        },
      });
      expect(result).toEqual(mockTask);
    });

    it('should delete empty dates from creation data', async () => {
      const inputData = { projetId: 'project-1', titre: 'Task 1', type: 'analyse', dateDebutPrevue: '', dateEcheance: '  ' };
      const mockTask = { id: 'task-1', projetId: 'project-1', titre: 'Task 1', type: 'analyse' };
      vi.mocked(prisma.task.create).mockResolvedValue(mockTask as any);

      const result = await service.create(inputData as any);

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          projetId: 'project-1',
          titre: 'Task 1',
          type: 'analyse',
        },
      });
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAllByProject', () => {
    it('should return tasks for specific project with timeEntries count', async () => {
      const mockTasks = [{ id: 'task-1', titre: 'Task 1' }];
      vi.mocked(prisma.task.findMany).mockResolvedValue(mockTasks as any);

      const result = await service.findAllByProject('project-1');

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { projetId: 'project-1' },
        include: {
          _count: { select: { timeEntries: true } },
        },
      });
      expect(result).toEqual(mockTasks);
    });
  });

  describe('findOne', () => {
    it('should return task by id with project name', async () => {
      const mockTask = { id: 'task-1', titre: 'Task 1' };
      vi.mocked(prisma.task.findUnique).mockResolvedValue(mockTask as any);

      const result = await service.findOne('task-1');

      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 'task-1' },
        include: {
          projet: { select: { nom: true } },
        },
      });
      expect(result).toEqual(mockTask);
    });
  });

  describe('update', () => {
    it('should update and return task', async () => {
      const mockTask = { id: 'task-1', titre: 'Updated Task' };
      vi.mocked(prisma.task.update).mockResolvedValue(mockTask as any);

      const result = await service.update('task-1', { titre: 'Updated Task' });

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: 'task-1' },
        data: { titre: 'Updated Task' },
      });
      expect(result).toEqual(mockTask);
    });
  });

  describe('remove', () => {
    it('should delete and return task', async () => {
      const mockTask = { id: 'task-1' };
      vi.mocked(prisma.task.delete).mockResolvedValue(mockTask as any);

      const result = await service.remove('task-1');

      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: 'task-1' },
      });
      expect(result).toEqual(mockTask);
    });
  });

  describe('addNote', () => {
    it('should create and return task note', async () => {
      const inputNote = { tacheId: 'task-1', userId: 'user-1', contenu: 'Note body' };
      const mockNote = { id: 'note-1', ...inputNote };
      vi.mocked((prisma as any).taskNote.create).mockResolvedValue(mockNote as any);

      const result = await service.addNote(inputNote as any);

      expect((prisma as any).taskNote.create).toHaveBeenCalledWith({
        data: inputNote,
      });
      expect(result).toEqual(mockNote);
    });
  });

  describe('findNotesByTask', () => {
    it('should return notes of task ordered by newest with user name', async () => {
      const mockNotes = [{ id: 'note-1', contenu: 'Note body', user: { firstName: 'Jane', lastName: 'Doe' } }];
      vi.mocked((prisma as any).taskNote.findMany).mockResolvedValue(mockNotes as any);

      const result = await service.findNotesByTask('task-1');

      expect((prisma as any).taskNote.findMany).toHaveBeenCalledWith({
        where: { tacheId: 'task-1' },
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockNotes);
    });
  });
});
