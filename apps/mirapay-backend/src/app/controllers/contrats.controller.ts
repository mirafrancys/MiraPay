import { Request, Response } from 'express';
import { ContratsService } from '../services/contrats.service';

const contratsService = new ContratsService();

export class ContratsController {
  async getAll(req: Request, res: Response) {
    res.json(await contratsService.findAll());
  }

  async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const data = await contratsService.findOne(id);
    if (!data) return res.status(404).json({ error: 'Contrat non trouvé' });
    res.json(data);
  }

  async create(req: Request, res: Response) {
    res.status(201).json(await contratsService.create(req.body));
  }

  async update(req: Request, res: Response) {
    res.json(await contratsService.update(req.params.id, req.body));
  }
}

export const contratsController = new ContratsController();

