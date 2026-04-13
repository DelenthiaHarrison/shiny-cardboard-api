const request = require('supertest');
const express = require('express');
const collectionsRouter = require('../routes/collections');
const cardsRouter = require('../routes/cards');
const setsRouter = require('../routes/sets');

const app = express();
app.use(express.json());
app.use('/sets', setsRouter);
app.use('/cards', cardsRouter);
app.use('/collections', collectionsRouter);

describe('Collections API', () => {
  test('GET /collections returns 200 and an array', async () => {
    const res = await request(app).get('/collections');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /collections/:id returns 404 for nonexistent entry', async () => {
    const res = await request(app).get('/collections/99999');
    expect(res.statusCode).toBe(404);
  });

  test('POST /collections returns 201 with valid data', async () => {
    const setRes = await request(app).post('/sets').send({
      name: 'Test Set ' + Date.now(),
      series: 'Test Series',
      totalCards: 100,
      releaseDate: '2024-01-01'
    });
    const cardRes = await request(app).post('/cards').send({
      name: 'Squirtle',
      cardNumber: '007/198',
      rarity: 'Common',
      type: 'Water',
      artist: 'Mitsuhiro Arita',
      setId: setRes.body.id
    });
    const res = await request(app).post('/collections').send({
      userId: 'testuser',
      cardId: cardRes.body.id,
      quantity: 1,
      condition: 'NM'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});