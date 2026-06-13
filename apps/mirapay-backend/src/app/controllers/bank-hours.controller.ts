import { Request, Response } from 'express';
import { BankHoursService } from '../services/bank-hours.service';

const bankHoursService = new BankHoursService();

export class BankHoursController {
  async getAll(req: Request, res: Response) {
    const { clientId, projetId } = req.query;
    
    if (clientId) {
      const banks = await bankHoursService.findAllByClient(clientId as string);
      return res.json(banks);
    }
    
    if (projetId) {
      const banks = await bankHoursService.findAllByProject(projetId as string);
      return res.json(banks);
    }

    res.status(400).json({ error: "Veuillez spécifier clientId ou projetId" });
  }

  async create(req: Request, res: Response) {
    const bank = await bankHoursService.create(req.body);
    res.status(201).json(bank);
  }
}

export const bankHoursController = new BankHoursController();

