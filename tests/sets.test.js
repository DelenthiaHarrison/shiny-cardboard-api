const request = require('supertest');
const express = require('express');
const setsRouter = require('../routes/sets');

const app = express();
app.use(express.json());
app.use('/sets', setsRouter);

describe('Sets API', () => {
  test('GET /sets returns 200 and an array', async () => {
    const res = await request(app).get('/sets');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /sets/:id returns 404 for nonexistent set', async () => {
    const res = await request(app).get('/sets/99999');
    expect(res.statusCode).toBe(404);
  });

  test('POST /sets returns 201 with valid data', async () => {
    const res = await request(app).post('/sets').send({
      name: 'Test Set ' + Date.now(),
      series: 'Test Series',
      totalCards: 100,
      releaseDate: '2024-01-01'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});