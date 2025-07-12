const request = require('supertest');
const app = require('../server');
const db = require('../db');

describe('Service Endpoints', () => {
  let agent; // Agente para manter a sessão de login

  // Antes de todos os testes, cria uma barbearia e faz o login
  beforeAll(async () => {
    await db.query('TRUNCATE public."barbershops" RESTART IDENTITY CASCADE');

    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Service Test Shop',
        email: 'service-test@example.com',
        password: 'password123',
      });
    
    const barbershopRes = await db.query('SELECT id FROM public."barbershops" WHERE email = $1', ['service-test@example.com']);
    const barbershopId = barbershopRes.rows[0].id;
    await db.query('UPDATE public."barbershops" SET is_approved = true WHERE id = $1', [barbershopId]);

    agent = request.agent(app);
    await agent
      .post('/api/auth/login')
      .send({
        email: 'service-test@example.com',
        password: 'password123',
      });
  });

  // Limpa a tabela de serviços antes de cada teste
  beforeEach(async () => {
    await db.query('TRUNCATE public."services" RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await db.pool.end();
  });

  // --- Testes para o CRUD de Serviços ---

  it('should create a new service successfully (POST /api/services)', async () => {
    const response = await agent
      .post('/api/services')
      .send({
        name: 'Corte de Cabelo',
        duration_minutes: 30,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Corte de Cabelo');
  });

  it('should not create a service with invalid data (POST /api/services)', async () => {
    const response = await agent
      .post('/api/services')
      .send({
        name: 'Corte',
        duration_minutes: -10, // Duração inválida
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });

  it('should list all services (GET /api/services)', async () => {
    await agent.post('/api/services').send({ name: 'Barba', duration_minutes: 20 });

    const response = await agent.get('/api/services');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Barba');
  });

  it('should update a service successfully (PUT /api/services/:id)', async () => {
    const createRes = await agent.post('/api/services').send({ name: 'Pintura', duration_minutes: 60 });
    const serviceId = createRes.body.id;

    const response = await agent
      .put(`/api/services/${serviceId}`)
      .send({
        name: 'Pintura de Cabelo',
        duration_minutes: 75,
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Pintura de Cabelo');
    expect(response.body.duration_minutes).toBe(75);
  });

  it('should delete a service successfully (DELETE /api/services/:id)', async () => {
    const createRes = await agent.post('/api/services').send({ name: 'Hidratação', duration_minutes: 45 });
    const serviceId = createRes.body.id;

    const response = await agent.delete(`/api/services/${serviceId}`);

    expect(response.statusCode).toBe(204);
  });
});
