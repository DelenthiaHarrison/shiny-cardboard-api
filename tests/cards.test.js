const request = require('supertest');
const express = require('express');
const cardsRouter = require('../routes/cards');
const setsRouter = require('../routes/sets');

const app = express();
app.use(express.json());
app.use('/sets', setsRouter);
app.use('/cards', cardsRouter);

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

  test('POST /cards returns 201 with valid data', async () => {
    const setRes = await request(app).post('/sets').send({
      name: 'Test Set ' + Date.now(),
      series: 'Test Series',
      totalCards: 100,
      releaseDate: '2024-01-01'
    });
    const setId = setRes.body.id;
    const res = await request(app).post('/cards').send({
      name: 'Bulbasaur',
      cardNumber: '001/198',
      rarity: 'Common',
      type: 'Grass',
      artist: 'Mitsuhiro Arita',
      setId
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});