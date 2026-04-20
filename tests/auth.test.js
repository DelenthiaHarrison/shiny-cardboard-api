const request = require('supertest');
const express = require('express');
const authRouter = require('../routes/auth');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth API', () => {
  test('POST /auth/register returns 201 with valid data', async () => {
    const res = await request(app).post('/auth/register').send({
      username: 'testuser' + Date.now(),
      email: 'test' + Date.now() + '@test.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
  });

  test('POST /auth/register returns 400 with missing fields', async () => {
    const res = await request(app).post('/auth/register').send({
      username: 'testuser'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /auth/login returns 200 with valid credentials', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'admin@shiny.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /auth/login returns 401 with invalid credentials', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'admin@shiny.com',
      password: 'wrongpassword'
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});