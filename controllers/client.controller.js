const db = require('../db');
const asyncHandler = require('../utils/asyncHandler');

// Criar um novo cliente
exports.createClient = asyncHandler(async (req, res) => {
  const barbershopId = req.barbershopId;
  const { name, phone_number } = req.body;

  const newClient = await db.query(
    'INSERT INTO public."clients" (barbershop_id, name, phone_number) VALUES ($1, $2, $3) RETURNING *',
    [barbershopId, name, phone_number]
  );
  res.status(201).json(newClient.rows[0]);
});

// Listar todos os clientes da barbearia logada
exports.getClients = asyncHandler(async (req, res) => {
  const barbershopId = req.barbershopId;

  const clients = await db.query('SELECT * FROM public."clients" WHERE barbershop_id = $1 ORDER BY name ASC', [barbershopId]);
  res.status(200).json(clients.rows);
});

// Atualizar um cliente específico
exports.updateClient = asyncHandler(async (req, res) => {
  const barbershopId = req.barbershopId;
  const clientId = req.params.id;
  const { name, phone_number } = req.body;

  const updatedClient = await db.query(
    'UPDATE public."clients" SET name = $1, phone_number = $2 WHERE id = $3 AND barbershop_id = $4 RETURNING *',
    [name, phone_number, clientId, barbershopId]
  );

  if (updatedClient.rows.length === 0) {
    return res.status(404).json({ message: 'Cliente não encontrado ou não pertence a esta barbearia.' });
  }

  res.status(200).json(updatedClient.rows[0]);
});

// Deletar um cliente específico
exports.deleteClient = async (req, res) => {
  const barbershopId = req.barbershopId;
  const clientId = req.params.id;

  try {
    const result = await db.query(
      'DELETE FROM public."clients" WHERE id = $1 AND barbershop_id = $2',
      [clientId, barbershopId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado ou não pertence a esta barbearia.' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Erro ao deletar cliente:', err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};