const request = require('supertest');
const app = require('../server');
const db = require('../db');
const bcrypt = require('bcryptjs');

describe('Auth Endpoints', () => {

  // Limpa a tabela antes de cada teste, especificando o schema 'public'.
  beforeEach(async () => {
    // Usamos TRUNCATE para limpar todas as tabelas e reiniciar as sequências de ID.
    // CASCADE garante que tabelas com chaves estrangeiras também sejam limpas.
    await db.query('TRUNCATE public."barbershops", public."clients", public."services", public."appointments" RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await db.pool.end();
  });

  // --- Testes para /register ---
  describe('POST /api/auth/register', () => {
    it('should register a new barbershop successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Barbershop',
          email: `test${Date.now()}@example.com`,
          password: 'password123',
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 409 if email already exists', async () => {
      const email = `conflict${Date.now()}@example.com`;
      await request(app)
        .post('/api/auth/register')
        .send({ name: 'First User', email, password: 'password123' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Second User', email, password: 'password456' });
      
      expect(response.statusCode).toBe(409);
    });

    it('should return 400 for invalid registration data (short password)', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Invalid Shop',
          email: `invalid${Date.now()}@example.com`,
          password: '123',
        });
      
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  // --- Testes para /login ---
  describe('POST /api/auth/login', () => {
    let userData;

    beforeEach(async () => {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('password123', salt);
      const email = `login${Date.now()}@example.com`;
      
      const res = await db.query(
        'INSERT INTO public."barbershops" (name, email, password_hash, is_approved) VALUES ($1, $2, $3, $4) RETURNING *',
        ['Login Shop', email, passwordHash, true]
      );
      userData = { ...res.rows[0], password: 'password123' };
    });

    it('should login an approved user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        });

      expect(response.statusCode).toBe(200);
      expect(response.headers['set-cookie'][0]).toContain('authToken=');
    });

    it('should return 401 for wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'wrongpassword',
        });

      expect(response.statusCode).toBe(401);
    });

    it('should return 401 for a non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nouser@example.com',
          password: 'password123',
        });

      expect(response.statusCode).toBe(401);
    });
  });
});
