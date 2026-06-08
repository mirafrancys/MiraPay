import { Request, Response } from 'express';
import { TimeEntriesService } from '../services/time-entries.service';

const timeEntriesService = new TimeEntriesService();

export class TimeEntriesController {
  async getAll(req: Request, res: Response) {
    try {
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
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const entry = await timeEntriesService.create(req.body);
      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const entry = await timeEntriesService.update(id, req.body);
      res.json(entry);
    } catch (error) {
      const msg = (error as Error).message;
      if (msg.includes("statut 'facture'")) {
        return res.status(400).json({ error: msg });
      }
      res.status(500).json({ error: msg });
    }
  }

  async approve(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const entry = await timeEntriesService.approve(id);
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await timeEntriesService.remove(id);
      res.status(204).send();
    } catch (error) {
      const msg = (error as Error).message;
      if (msg.includes("statut 'facture'")) {
        return res.status(400).json({ error: msg });
      }
      res.status(500).json({ error: msg });
    }
  }
}

export const timeEntriesController = new TimeEntriesController();

