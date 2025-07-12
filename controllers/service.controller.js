const db = require('../db');
const asyncHandler = require('../utils/asyncHandler');


// Criar um novo serviço
exports.createService = asyncHandler(async (req, res) => {
  const barbershopId = req.barbershopId;
  const { name, duration_minutes } = req.body;

  const newService = await db.query(
    'INSERT INTO public."services" (barbershop_id, name, duration_minutes) VALUES ($1, $2, $3) RETURNING *',
    [barbershopId, name, Number(duration_minutes)]
  );
  res.status(201).json(newService.rows[0]);
});

// Listar todos os serviços da barbearia logada
exports.getServices = asyncHandler(async (req, res) => {
  const barbershopId = req.barbershopId;

  const services = await db.query('SELECT * FROM public."services" WHERE barbershop_id = $1 ORDER BY name ASC', [barbershopId]);
  res.status(200).json(services.rows);
});


// Atualizar um serviço específico
exports.updateService = asyncHandler(async (req, res) => {
  const barbershopId = req.barbershopId;
  const serviceId = req.params.id;
  const { name, duration_minutes } = req.body;

  const updatedService = await db.query(
    'UPDATE public."services" SET name = $1, duration_minutes = $2 WHERE id = $3 AND barbershop_id = $4 RETURNING *',
    [name, Number(duration_minutes), serviceId, barbershopId]
  );

  if (updatedService.rows.length === 0) {
    return res.status(404).json({ message: 'Serviço não encontrado ou não pertence a esta barbearia.' });
  }

  res.status(200).json(updatedService.rows[0]);
});

// Deletar um serviço específico
exports.deleteService = asyncHandler(async (req, res) => {
  const barbershopId = req.barbershopId;
  const serviceId = req.params.id;

  const result = await db.query(
    'DELETE FROM public."services" WHERE id = $1 AND barbershop_id = $2',
    [serviceId, barbershopId]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Serviço não encontrado ou não pertence a esta barbearia.' });
  }

  res.status(204).send();
});
