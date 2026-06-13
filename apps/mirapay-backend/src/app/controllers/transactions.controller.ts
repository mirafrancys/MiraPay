import { Request, Response } from 'express';
import { TransactionsService } from '../services/transactions.service';

const transactionsService = new TransactionsService();

export class TransactionsController {
  async getAll(req: Request, res: Response) {
    const transactions = await transactionsService.getAllTransactions();
    res.json(transactions);
  }

  async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const transaction = await transactionsService.getTransactionById(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  }

  async create(req: Request, res: Response) {
    const { amount, currency, userId, status } = req.body;
    const transaction = await transactionsService.createTransaction({
      amount,
      currency,
      userId,
      status: status || 'PENDING',
    });
    res.status(201).json(transaction);
  }

  async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;
    const transaction = await transactionsService.updateTransactionStatus(id, status);
    res.json(transaction);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await transactionsService.deleteTransaction(id);
    res.status(204).send();
  }
}

export const transactionsController = new TransactionsController();

