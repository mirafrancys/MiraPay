import { Request, Response } from 'express';
import { ContactsService } from '../services/contacts.service';

const contactsService = new ContactsService();

export class ContactsController {
  async create(req: Request, res: Response) {
    const contact = await contactsService.create(req.body);
    res.status(201).json(contact);
  }

  async getAllByClient(req: Request, res: Response) {
    const { clientId } = req.params;
    const contacts = await contactsService.findAllByClient(clientId);
    res.json(contacts);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await contactsService.archive(id);
    res.status(204).send();
  }
}

export const contactsController = new ContactsController();

