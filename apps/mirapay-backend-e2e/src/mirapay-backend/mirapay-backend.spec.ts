import axios from 'axios';

describe('API Endpoints', () => {
  it('should return welcome message from /api', async () => {
    const res = await axios.get(`/api`);
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Hello API' });
  });

  it('should return transactions from /api/transactions', async () => {
    const res = await axios.get(`/api/transactions`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data[0]).toHaveProperty('amount');
  });
});
