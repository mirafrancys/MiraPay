import { Request, Response } from 'express';
import { ContratsService } from '../services/contrats.service';

const contratsService = new ContratsService();

export class ContratsController {
  async getAll(req: Request, res: Response) {
    try {
      res.json(await contratsService.findAll());
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await contratsService.findOne(id);
      if (!data) return res.status(404).json({ error: 'Contrat non trouvé' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      res.status(201).json(await contratsService.create(req.body));
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      res.json(await contratsService.update(req.params.id, req.body));
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export const contratsController = new ContratsController();

