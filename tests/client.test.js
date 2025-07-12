const request = require('supertest');
const app = require('../server');
const db = require('../db');

describe('Client Endpoints', () => {
  let agent; // Usaremos um 'agent' do supertest para manter a sessão de login (cookies)
  let barbershopId;

  // Antes de todos os testes desta suíte, cria uma barbearia e faz o login
  beforeAll(async () => {
    // Limpa a tabela para um estado inicial limpo
    await db.query('TRUNCATE public."barbershops" RESTART IDENTITY CASCADE');

    // Cria a barbearia de teste
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Client Test Shop',
        email: 'client-test@example.com',
        password: 'password123',
      });
    
    // Obtém o ID da barbearia e a aprova (simulando a aprovação manual do admin)
    const barbershopRes = await db.query('SELECT id FROM public."barbershops" WHERE email = $1', ['client-test@example.com']);
    barbershopId = barbershopRes.rows[0].id;
    await db.query('UPDATE public."barbershops" SET is_approved = true WHERE id = $1', [barbershopId]);

    // Cria um agente para manter a sessão e faz o login para obter o cookie
    agent = request.agent(app);
    await agent
      .post('/api/auth/login')
      .send({
        email: 'client-test@example.com',
        password: 'password123',
      });
  });

  // Limpa a tabela de clientes antes de cada teste individual
  beforeEach(async () => {
    await db.query('TRUNCATE public."clients" RESTART IDENTITY CASCADE');
  });

  // Fecha a conexão com o banco após todos os testes
  afterAll(async () => {
    await db.pool.end();
  });

  // --- Testes para o CRUD de Clientes ---

  it('should create a new client successfully (POST /api/clients)', async () => {
    const response = await agent // Usa o agente autenticado
      .post('/api/clients')
      .send({
        name: 'John Doe',
        phone_number: '5511999998888',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('John Doe');
  });

  it('should not create a client with invalid data (POST /api/clients)', async () => {
    const response = await agent
      .post('/api/clients')
      .send({ name: 'J' }); // Nome muito curto, deve ser rejeitado pelo Zod

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });

  it('should list all clients for the logged-in barbershop (GET /api/clients)', async () => {
    // Cria um cliente primeiro
    await agent.post('/api/clients').send({ name: 'Jane Smith', phone_number: '5521911112222' });

    const response = await agent.get('/api/clients');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Jane Smith');
  });

  it('should update a client successfully (PUT /api/clients/:id)', async () => {
    // Cria um cliente para depois atualizar
    const createRes = await agent.post('/api/clients').send({ name: 'Update Me', phone_number: '1234567890' });
    const clientId = createRes.body.id;

    const response = await agent
      .put(`/api/clients/${clientId}`)
      .send({
        name: 'Successfully Updated',
        phone_number: '0987654321',
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Successfully Updated');
  });

  it('should delete a client successfully (DELETE /api/clients/:id)', async () => {
    // Cria um cliente para depois deletar
    const createRes = await agent.post('/api/clients').send({ name: 'Delete Me', phone_number: '5555555555' });
    const clientId = createRes.body.id;

    const response = await agent.delete(`/api/clients/${clientId}`);

    expect(response.statusCode).toBe(204); // No Content
  });

  it('should not allow access to unauthenticated users', async () => {
    // Usa 'request(app)' que não tem o cookie de sessão
    const response = await request(app).get('/api/clients');
    
    expect(response.statusCode).toBe(403); // Forbidden
  });
});