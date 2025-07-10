const db = require('../db');

// Criar um novo agendamento
exports.createAppointment = async (req, res) => {
  const barbershopId = req.barbershopId;
  const { client_id, service_id, appointment_time } = req.body;

  if (!client_id || !service_id || !appointment_time) {
    return res.status(400).json({ message: 'Cliente, serviço e horário são obrigatórios.' });
  }

  try {
    // 1. Buscar a duração do serviço para calcular o horário final do agendamento
    const serviceResult = await db.query('SELECT duration_minutes FROM services WHERE id = $1 AND barbershop_id = $2', [service_id, barbershopId]);
    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ message: 'Serviço não encontrado.' });
    }
    const duration = serviceResult.rows[0].duration_minutes;

    const startTime = new Date(appointment_time);
    const endTime = new Date(startTime.getTime() + duration * 60000); // Adiciona a duração em milissegundos

    // 2. Verificar se existe algum agendamento conflitante para a mesma barbearia
    const conflictResult = await db.query(
      `SELECT * FROM appointments 
       WHERE barbershop_id = $1 
       AND status = 'scheduled'
       AND (appointment_time, appointment_time + (SELECT duration_minutes FROM services WHERE id = service_id) * interval '1 minute') 
           OVERLAPS ($2::timestamptz, $3::timestamptz)`,
      [barbershopId, startTime, endTime]
    );

    if (conflictResult.rows.length > 0) {
      return res.status(409).json({ message: 'Conflito de horário. Já existe um agendamento neste período.' });
    }

    // 3. Se não houver conflito, criar o agendamento
    const newAppointment = await db.query(
      'INSERT INTO appointments (barbershop_id, client_id, service_id, appointment_time) VALUES ($1, $2, $3, $4) RETURNING *',
      [barbershopId, client_id, service_id, startTime]
    );

    res.status(201).json(newAppointment.rows[0]);
  } catch (err) {
    console.error('Erro ao criar agendamento:', err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Listar agendamentos (com opção de filtrar por data)
exports.getAppointments = async (req, res) => {
  const barbershopId = req.barbershopId;
  const { date } = req.query; // Pega a data da query string, ex: /api/appointments?date=2025-07-09

  let queryText = `
    SELECT 
      a.id, 
      a.appointment_time, 
      a.status,
      c.name as client_name,
      s.name as service_name,
      s.duration_minutes
    FROM appointments a
    JOIN clients c ON a.client_id = c.id
    JOIN services s ON a.service_id = s.id
    WHERE a.barbershop_id = $1
  `;
  const queryParams = [barbershopId];

  // Se uma data for fornecida, filtra os agendamentos para aquele dia
  if (date) {
    queryText += ' AND (a.appointment_time AT TIME ZONE \'America/Sao_Paulo\')::date = $2';
    queryParams.push(date);
  }
  
  queryText += ' ORDER BY a.appointment_time ASC';

  try {
    const appointments = await db.query(queryText, queryParams);
    res.status(200).json(appointments.rows);
  } catch (err) {
    console.error('Erro ao buscar agendamentos:', err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Cancelar um agendamento
exports.cancelAppointment = async (req, res) => {
    const barbershopId = req.barbershopId;
    const appointmentId = req.params.id;

    try {
        const result = await db.query(
            "UPDATE appointments SET status = 'canceled' WHERE id = $1 AND barbershop_id = $2 RETURNING *",
            [appointmentId, barbershopId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Agendamento não encontrado ou não pertence a esta barbearia.' });
        }

        res.status(200).json({ message: 'Agendamento cancelado com sucesso.', appointment: result.rows[0] });
    } catch (err) {
        console.error('Erro ao cancelar agendamento:', err);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};