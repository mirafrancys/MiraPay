import { Request, Response } from 'express';
import { ContactsService } from '../services/contacts.service';

const contactsService = new ContactsService();

export class ContactsController {
  async create(req: Request, res: Response) {
    try {
      const contact = await contactsService.create(req.body);
      res.status(201).json(contact);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getAllByClient(req: Request, res: Response) {
    try {
      const { clientId } = req.params;
      const contacts = await contactsService.findAllByClient(clientId);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await contactsService.archive(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export const contactsController = new ContactsController();

