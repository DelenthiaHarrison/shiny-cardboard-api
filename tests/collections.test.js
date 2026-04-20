const request = require('supertest');
const express = require('express');
const collectionsRouter = require('../routes/collections');
const authRouter = require('../routes/auth');
const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.use('/collections', collectionsRouter);
let userToken;
beforeAll(async () => {
  const res = await request(app).post('/auth/login').send({ email: 'user@shiny.com', password: 'password123' });
  userToken = res.body.token;
});
describe('Collections API', () => {
  test('GET /collections returns 401 without token', async () => {
    const res = await request(app).get('/collections');
    expect(res.statusCode).toBe(401);
  });
  test('GET /collections returns 200 with token', async () => {
    const res = await request(app).get('/collections').set('Authorization', 'Bearer ' + userToken);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  test('POST /collections returns 401 without token', async () => {
    const res = await request(app).post('/collections').send({ name: 'Test Binder' });
    expect(res.statusCode).toBe(401);
  });
  test('POST /collections returns 201 with token', async () => {
    const res = await request(app).post('/collections').set('Authorization', 'Bearer ' + userToken).send({ name: 'Test Binder ' + Date.now() });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});