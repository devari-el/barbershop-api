const request = require('supertest');
const app = require('../server');
const db = require('../db');

describe('Appointment Endpoints', () => {
  let agent;
  let barbershopId;
  let clientId;
  let serviceId;

  // Antes de todos os testes, prepara o ambiente completo
  beforeAll(async () => {
    // Limpeza inicial
    await db.query('TRUNCATE public."barbershops", public."clients", public."services", public."appointments" RESTART IDENTITY CASCADE');

    // 1. Cria a barbearia e aprova
    await request(app).post('/api/auth/register').send({ name: 'Appointment Test Shop', email: 'appointment-test@example.com', password: 'password123' });
    const barbershopRes = await db.query('SELECT id FROM public."barbershops" WHERE email = $1', ['appointment-test@example.com']);
    barbershopId = barbershopRes.rows[0].id;
    await db.query('UPDATE public."barbershops" SET is_approved = true WHERE id = $1', [barbershopId]);

    // 2. Faz o login para obter o cookie de sessão
    agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: 'appointment-test@example.com', password: 'password123' });

    // 3. Cria um cliente e um serviço para usar nos testes
    const clientRes = await agent.post('/api/clients').send({ name: 'Test Client', phone_number: '1111111111' });
    clientId = clientRes.body.id;

    const serviceRes = await agent.post('/api/services').send({ name: 'Test Service', duration_minutes: 60 });
    serviceId = serviceRes.body.id;
  });

  // Limpa a tabela de agendamentos antes de cada teste
  beforeEach(async () => {
    await db.query('TRUNCATE public."appointments" RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await db.pool.end();
  });

  // --- Testes para o CRUD de Agendamentos ---

  it('should create a new appointment successfully (POST /api/appointments)', async () => {
    const appointmentTime = new Date();
    appointmentTime.setHours(14, 0, 0, 0);

    const response = await agent
      .post('/api/appointments')
      .send({
        client_id: clientId,
        service_id: serviceId,
        appointment_time: appointmentTime.toISOString(),
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.status).toBe('scheduled');
  });

  it('should not create an appointment with invalid data (POST /api/appointments)', async () => {
    const response = await agent
      .post('/api/appointments')
      .send({
        client_id: clientId,
        // service_id faltando
        appointment_time: new Date().toISOString(),
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });
  
  it('should not create an appointment that conflicts with another (POST /api/appointments)', async () => {
    const appointmentTime = new Date();
    appointmentTime.setHours(15, 0, 0, 0);

    // Cria o primeiro agendamento
    await agent.post('/api/appointments').send({ client_id: clientId, service_id: serviceId, appointment_time: appointmentTime.toISOString() });

    // Tenta criar outro no mesmo horário
    const response = await agent
      .post('/api/appointments')
      .send({
        client_id: clientId,
        service_id: serviceId,
        appointment_time: appointmentTime.toISOString(),
      });

    expect(response.statusCode).toBe(409); // Conflict
    expect(response.body).toHaveProperty('message', 'Conflito de horário. Já existe um agendamento neste período.');
  });

  it('should list all appointments (GET /api/appointments)', async () => {
    const appointmentTime = new Date();
    appointmentTime.setHours(16, 0, 0, 0);
    await agent.post('/api/appointments').send({ client_id: clientId, service_id: serviceId, appointment_time: appointmentTime.toISOString() });

    const response = await agent.get('/api/appointments');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it('should cancel an appointment successfully (PATCH /api/appointments/:id/cancel)', async () => {
    const appointmentTime = new Date();
    appointmentTime.setHours(17, 0, 0, 0);
    const createRes = await agent.post('/api/appointments').send({ client_id: clientId, service_id: serviceId, appointment_time: appointmentTime.toISOString() });
    const appointmentId = createRes.body.id;

    const response = await agent.patch(`/api/appointments/${appointmentId}/cancel`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.appointment.status).toBe('canceled');
  });
});
