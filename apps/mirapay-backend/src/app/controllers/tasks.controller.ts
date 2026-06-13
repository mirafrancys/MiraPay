import { Request, Response } from 'express';
import { TasksService } from '../services/tasks.service';

const tasksService = new TasksService();

export class TasksController {
  async getByProject(req: Request, res: Response) {
    const { projectId } = req.params;
    const tasks = await tasksService.findAllByProject(projectId);
    res.json(tasks);
  }

  async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const task = await tasksService.findOne(id);
    if (!task) {
      return res.status(404).json({ error: `Task with ID ${id} not found` });
    }
    res.json(task);
  }

  async create(req: Request, res: Response) {
    const task = await tasksService.create(req.body);
    res.status(201).json(task);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const task = await tasksService.update(id, req.body);
    res.json(task);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await tasksService.remove(id);
    res.status(204).send();
  }

  async addNote(req: Request, res: Response) {
    const { taskId } = req.params;
    const { contenu, userId } = req.body;
    const note = await tasksService.addNote({
      contenu,
      tache: { connect: { id: taskId } },
      user: { connect: { id: userId } }
    });
    res.status(201).json(note);
  }

  async getNotes(req: Request, res: Response) {
    const { taskId } = req.params;
    const notes = await tasksService.findNotesByTask(taskId);
    res.json(notes);
  }
}

export const tasksController = new TasksController();

