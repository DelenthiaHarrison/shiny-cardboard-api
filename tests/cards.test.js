const request = require('supertest');
const express = require('express');
const cardsRouter = require('../routes/cards');
const setsRouter = require('../routes/sets');
const authRouter = require('../routes/auth');
const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.use('/sets', setsRouter);
app.use('/cards', cardsRouter);
let adminToken;
beforeAll(async () => {
  const res = await request(app).post('/auth/login').send({ email: 'admin@shiny.com', password: 'password123' });
  adminToken = res.body.token;
});
describe('Cards API', () => {
  test('GET /cards returns 200 and an array', async () => {
    const res = await request(app).get('/cards');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  test('GET /cards/:id returns 404 for nonexistent card', async () => {
    const res = await request(app).get('/cards/99999');
    expect(res.statusCode).toBe(404);
  });
  test('POST /cards returns 401 without token', async () => {
    const res = await request(app).post('/cards').send({ name: 'Bulbasaur', cardNumber: '001/198', rarity: 'Common', type: 'Grass', artist: 'Test', setId: 1 });
    expect(res.statusCode).toBe(401);
  });
  test('POST /cards returns 201 with admin token', async () => {
    const setRes = await request(app).post('/sets').set('Authorization', 'Bearer ' + adminToken).send({ name: 'Test Set ' + Date.now(), setCode: 'TC' + Date.now(), series: 'Test', totalCards: 100, releaseDate: '2024-01-01' });
    const res = await request(app).post('/cards').set('Authorization', 'Bearer ' + adminToken).send({ name: 'Bulbasaur', cardNumber: '001/198', rarity: 'Common', type: 'Grass', artist: 'Mitsuhiro Arita', setId: setRes.body.id });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});