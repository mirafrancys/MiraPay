import { Request, Response } from 'express';
import { TransactionsService } from './transactions.service';

const transactionsService = new TransactionsService();

export class TransactionsController {
  async getAll(req: Request, res: Response) {
    try {
      const transactions = await transactionsService.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const transaction = await transactionsService.getTransactionById(id);
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch transaction' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { amount, currency, userId, status } = req.body;
      const transaction = await transactionsService.createTransaction({
        amount,
        currency,
        userId,
        status: status || 'PENDING',
      });
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const transaction = await transactionsService.updateTransactionStatus(id, status);
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update transaction status' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await transactionsService.deleteTransaction(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete transaction' });
    }
  }
}

export const transactionsController = new TransactionsController();
