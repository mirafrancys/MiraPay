import { Request, Response } from 'express';
import { InvoicesService } from '../services/invoices.service';

const invoicesService = new InvoicesService();

export class InvoicesController {
  async getAll(req: Request, res: Response) {
    const invoices = await invoicesService.findAll();
    res.json(invoices);
  }

  async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const invoice = await invoicesService.findOne(id);
    if (!invoice) {
      return res.status(404).json({ error: `Invoice with ID ${id} not found` });
    }
    res.json(invoice);
  }

  async prepareDraft(req: Request, res: Response) {
    const { clientId, projetId, dateDebut, dateFin } = req.body;
    if (!clientId) {
      return res.status(400).json({ error: "clientId est requis pour préparer un brouillon de facture." });
    }

    const draft = await invoicesService.prepareDraft(clientId, projetId, { dateDebut, dateFin });
    res.status(200).json(draft);
  }

  async create(req: Request, res: Response) {
    const { timeEntryIds, ...invoiceData } = req.body;
    const invoice = await invoicesService.create(invoiceData, timeEntryIds || []);
    res.status(201).json(invoice);
  }

  async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { statut } = req.body;
    const invoice = await invoicesService.updateStatus(id, statut);
    res.json(invoice);
  }
}

export const invoicesController = new InvoicesController();

