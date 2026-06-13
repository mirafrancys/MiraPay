import { Request, Response } from 'express';
import { UsersService } from '../services/users.service';

const usersService = new UsersService();

export class UsersController {
  async getAll(req: Request, res: Response) {
    const users = await usersService.findAll();
    res.json(users);
  }

  async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const user = await usersService.findOne(id);
    if (!user) {
      return res.status(404).json({ error: `User with ID ${id} not found` });
    }
    res.json(user);
  }

  async create(req: Request, res: Response) {
    const user = await usersService.create(req.body);
    res.status(201).json(user);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const user = await usersService.update(id, req.body);
    res.json(user);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await usersService.remove(id);
    res.status(204).send();
  }
}

export const usersController = new UsersController();

