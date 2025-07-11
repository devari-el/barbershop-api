const db = require('../db');

// Criar um novo serviço
exports.createService = async (req, res) => {
  const barbershopId = req.barbershopId;
  const { name, duration_minutes } = req.body;

  try {
    const newService = await db.query(
      'INSERT INTO services (barbershop_id, name, duration_minutes) VALUES ($1, $2, $3) RETURNING *',
      [barbershopId, name, Number(duration_minutes)]
    );
    res.status(201).json(newService.rows[0]);
  } catch (err) {
    console.error('Erro ao criar serviço:', err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Listar todos os serviços da barbearia logada
exports.getServices = async (req, res) => {
  const barbershopId = req.barbershopId;

  try {
    const services = await db.query('SELECT * FROM services WHERE barbershop_id = $1 ORDER BY name ASC', [barbershopId]);
    res.status(200).json(services.rows);
  } catch (err) {
    console.error('Erro ao buscar serviços:', err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Atualizar um serviço específico
exports.updateService = async (req, res) => {
  const barbershopId = req.barbershopId;
  const serviceId = req.params.id;
  const { name, duration_minutes } = req.body;

  try {
    const updatedService = await db.query(
      'UPDATE services SET name = $1, duration_minutes = $2 WHERE id = $3 AND barbershop_id = $4 RETURNING *',
      [name, Number(duration_minutes), serviceId, barbershopId]
    );

    if (updatedService.rows.length === 0) {
      return res.status(404).json({ message: 'Serviço não encontrado ou não pertence a esta barbearia.' });
    }

    res.status(200).json(updatedService.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar serviço:', err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Deletar um serviço específico
exports.deleteService = async (req, res) => {
  const barbershopId = req.barbershopId;
  const serviceId = req.params.id;

  try {
    const result = await db.query(
      'DELETE FROM services WHERE id = $1 AND barbershop_id = $2',
      [serviceId, barbershopId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Serviço não encontrado ou não pertence a esta barbearia.' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Erro ao deletar serviço:', err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};