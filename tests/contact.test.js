const request = require('supertest');
const app = require('../src/app');

jest.setTimeout(10000);

describe('POST /api/contact', () => {
  test('returns 400 on invalid payload', async () => {
    const res = await request(app).post('/api/contact').send({ name: '', email: 'bad', message: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('succeeds with valid payload', async () => {
    const payload = { name: 'Alice', email: 'alice@example.com', message: 'Hi there' };
    const res = await request(app).post('/api/contact').send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });
});
