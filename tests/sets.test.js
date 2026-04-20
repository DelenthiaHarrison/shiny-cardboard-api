const request = require('supertest');
const express = require('express');
const setsRouter = require('../routes/sets');
const authRouter = require('../routes/auth');
const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.use('/sets', setsRouter);
let adminToken;
beforeAll(async () => {
  const res = await request(app).post('/auth/login').send({ email: 'admin@shiny.com', password: 'password123' });
  adminToken = res.body.token;
});
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
  test('POST /sets returns 401 without token', async () => {
    const res = await request(app).post('/sets').send({ name: 'Test', setCode: 'TST', series: 'Test', totalCards: 100, releaseDate: '2024-01-01' });
    expect(res.statusCode).toBe(401);
  });
  test('POST /sets returns 201 with admin token', async () => {
    const res = await request(app).post('/sets').set('Authorization', 'Bearer ' + adminToken).send({ name: 'Test Set ' + Date.now(), setCode: 'TS' + Date.now(), series: 'Test', totalCards: 100, releaseDate: '2024-01-01' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});