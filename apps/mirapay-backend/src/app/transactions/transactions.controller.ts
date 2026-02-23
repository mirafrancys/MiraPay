import { Controller, Get } from '@nestjs/common';
import { Transaction } from '@mirapay/shared-models';

@Controller('transactions')
export class TransactionsController {
  @Get()
  getTransactions(): Transaction[] {
    return [
      {
        id: '1',
        amount: 150.0,
        currency: 'USD',
        status: 'COMPLETED',
        createdAt: new Date(),
        userId: 'user-1',
      },
      {
        id: '2',
        amount: 25.5,
        currency: 'EUR',
        status: 'PENDING',
        createdAt: new Date(),
        userId: 'user-2',
      },
    ];
  }
}
