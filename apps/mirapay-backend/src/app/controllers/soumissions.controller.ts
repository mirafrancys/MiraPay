import { Request, Response } from 'express';
import { SoumissionsService } from '../services/soumissions.service';

const soumissionsService = new SoumissionsService();

export class SoumissionsController {
  async getAll(req: Request, res: Response) {
    try {
      res.json(await soumissionsService.findAll());
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await soumissionsService.findOne(id);
      if (!data) return res.status(404).json({ error: 'Soumission non trouvée' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      res.status(201).json(await soumissionsService.create(req.body));
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      res.json(await soumissionsService.update(req.params.id, req.body));
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export const soumissionsController = new SoumissionsController();

