import { Request, Response } from 'express';
import { ClientsService } from '../services/clients.service';

const clientsService = new ClientsService();

export class ClientsController {
  async getAll(req: Request, res: Response) {
    const clients = await clientsService.findAll();
    res.json(clients);
  }

  async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const client = await clientsService.findOne(id);
    if (!client) {
      return res.status(404).json({ error: `Client with ID ${id} not found` });
    }
    res.json(client);
  }

  async create(req: Request, res: Response) {
    const client = await clientsService.create(req.body);
    res.status(201).json(client);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const client = await clientsService.update(id, req.body);
    res.json(client);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await clientsService.remove(id);
    res.status(204).send();
  }

  async archive(req: Request, res: Response) {
    const { id } = req.params;
    const client = await clientsService.archive(id);
    res.json(client);
  }
}

export const clientsController = new ClientsController();

