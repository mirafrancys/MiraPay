import { Request, Response } from 'express';
import { SoumissionsService } from '../services/soumissions.service';

const soumissionsService = new SoumissionsService();

export class SoumissionsController {
  async getAll(req: Request, res: Response) {
    res.json(await soumissionsService.findAll());
  }

  async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const data = await soumissionsService.findOne(id);
    if (!data) return res.status(404).json({ error: 'Soumission non trouvée' });
    res.json(data);
  }

  async create(req: Request, res: Response) {
    res.status(201).json(await soumissionsService.create(req.body));
  }

  async update(req: Request, res: Response) {
    res.json(await soumissionsService.update(req.params.id, req.body));
  }
}

export const soumissionsController = new SoumissionsController();

