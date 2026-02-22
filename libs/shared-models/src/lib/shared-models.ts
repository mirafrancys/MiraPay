export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  userId: string;
}
