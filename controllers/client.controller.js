const db = require('../db');

// Criar um novo cliente
exports.createClient = async (req, res) => {
  // O ID da barbearia vem do token que foi decodificado no middleware
  const barbershopId = req.barbershopId;
  const { name, phone_number } = req.body;

  try {
    const newClient = await db.query(
      'INSERT INTO clients (barbershop_id, name, phone_number) VALUES ($1, $2, $3) RETURNING *',
      [barbershopId, name, phone_number]
    );
    res.status(201).json(newClient.rows[0]);
  } catch (err) {
    console.error('Erro ao criar cliente:', err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Listar todos os clientes da barbearia logada
exports.getClients = async (req, res) => {
  const barbershopId = req.barbershopId;

  try {
    const clients = await db.query('SELECT * FROM clients WHERE barbershop_id = $1 ORDER BY name ASC', [barbershopId]);
    res.status(200).json(clients.rows);
  } catch (err) {
    console.error('Erro ao buscar clientes:', err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Atualizar um cliente específico
exports.updateClient = async (req, res) => {
  const barbershopId = req.barbershopId;
  const clientId = req.params.id; // Pega o ID do cliente da URL (ex: /api/clients/12)
  const { name, phone_number } = req.body;

  try {
    const updatedClient = await db.query(
      'UPDATE clients SET name = $1, phone_number = $2 WHERE id = $3 AND barbershop_id = $4 RETURNING *',
      [name, phone_number, clientId, barbershopId]
    );

    // Se a consulta não retornar nenhuma linha, o cliente não foi encontrado ou não pertence à barbearia
    if (updatedClient.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado ou não pertence a esta barbearia.' });
    }

    res.status(200).json(updatedClient.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar cliente:', err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Deletar um cliente específico
exports.deleteClient = async (req, res) => {
  const barbershopId = req.barbershopId;
  const clientId = req.params.id;

  try {
    const result = await db.query(
      'DELETE FROM clients WHERE id = $1 AND barbershop_id = $2',
      [clientId, barbershopId]
    );

    // a propriedade rowCount informa quantas linhas foram afetadas pelo DELETE
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado ou não pertence a esta barbearia.' });
    }

    res.status(204).send(); // 204 No Content é a resposta padrão para um delete bem-sucedido
  } catch (err) {
    console.error('Erro ao deletar cliente:', err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};