import { Request, Response } from 'express';
import { TimeEntriesService } from '../services/time-entries.service';

const timeEntriesService = new TimeEntriesService();

export class TimeEntriesController {
  async getAll(req: Request, res: Response) {
    const filters = {
      projetId: req.query.projetId as string,
      userId: req.query.userId as string,
      statut: req.query.statut as string,
      estFacturable: req.query.estFacturable ? req.query.estFacturable === 'true' : undefined,
      dateDebut: req.query.dateDebut as string,
      dateFin: req.query.dateFin as string
    };

    const entries = await timeEntriesService.findAll(filters);
    res.json(entries);
  }

  async create(req: Request, res: Response) {
    const entry = await timeEntriesService.create(req.body);
    res.status(201).json(entry);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const entry = await timeEntriesService.update(id, req.body);
    res.json(entry);
  }

  async approve(req: Request, res: Response) {
    const { id } = req.params;
    const entry = await timeEntriesService.approve(id);
    res.json(entry);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await timeEntriesService.remove(id);
    res.status(204).send();
  }
}

export const timeEntriesController = new TimeEntriesController();

