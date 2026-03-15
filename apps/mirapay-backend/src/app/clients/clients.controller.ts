import { Request, Response } from 'express';
import { ClientsService } from './clients.service';

const clientsService = new ClientsService();

export class ClientsController {
  async getAll(req: Request, res: Response) {
    try {
      const clients = await clientsService.findAll();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const client = await clientsService.findOne(id);
      if (!client) {
        return res.status(404).json({ error: `Client with ID ${id} not found` });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const client = await clientsService.create(req.body);
      res.status(201).json(client);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const client = await clientsService.update(id, req.body);
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await clientsService.remove(id);
      res.status(204).send();
    } catch (error) {
      const msg = (error as Error).message;
      if (msg.includes("possède des projets")) {
        return res.status(400).json({ error: msg });
      }
      res.status(500).json({ error: msg });
    }
  }

  async archive(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const client = await clientsService.archive(id);
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export const clientsController = new ClientsController();
