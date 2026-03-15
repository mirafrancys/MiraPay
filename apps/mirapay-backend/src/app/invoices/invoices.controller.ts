import { Request, Response } from 'express';
import { InvoicesService } from './invoices.service';

const invoicesService = new InvoicesService();

export class InvoicesController {
  async getAll(req: Request, res: Response) {
    try {
      const invoices = await invoicesService.findAll();
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const invoice = await invoicesService.findOne(id);
      if (!invoice) {
        return res.status(404).json({ error: `Invoice with ID ${id} not found` });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async prepareDraft(req: Request, res: Response) {
    try {
      const { clientId, projetId, dateDebut, dateFin } = req.body;
      if (!clientId) {
        return res.status(400).json({ error: "clientId est requis pour préparer un brouillon de facture." });
      }

      const draft = await invoicesService.prepareDraft(clientId, projetId, { dateDebut, dateFin });
      res.status(200).json(draft);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { timeEntryIds, ...invoiceData } = req.body;
      const invoice = await invoicesService.create(invoiceData, timeEntryIds || []);
      res.status(201).json(invoice);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { statut } = req.body;
      const invoice = await invoicesService.updateStatus(id, statut);
      res.json(invoice);
    } catch (error) {
      const msg = (error as Error).message;
      if (msg.includes("statut 'annulee'")) {
        return res.status(400).json({ error: msg });
      }
      res.status(500).json({ error: msg });
    }
  }
}

export const invoicesController = new InvoicesController();
