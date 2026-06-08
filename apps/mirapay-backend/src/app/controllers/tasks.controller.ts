import { Request, Response } from 'express';
import { TasksService } from '../services/tasks.service';

const tasksService = new TasksService();

export class TasksController {
  async getByProject(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const tasks = await tasksService.findAllByProject(projectId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const task = await tasksService.findOne(id);
      if (!task) {
        return res.status(404).json({ error: `Task with ID ${id} not found` });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const task = await tasksService.create(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const task = await tasksService.update(id, req.body);
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await tasksService.remove(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async addNote(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const { contenu, userId } = req.body;
      const note = await tasksService.addNote({
        contenu,
        tache: { connect: { id: taskId } },
        user: { connect: { id: userId } }
      });
      res.status(201).json(note);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getNotes(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const notes = await tasksService.findNotesByTask(taskId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export const tasksController = new TasksController();

