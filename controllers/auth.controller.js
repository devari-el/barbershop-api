const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Função para registrar uma nova barbearia
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validação simples dos dados de entrada
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Por favor, forneça nome, email e senha.' });
  }

  try {
    // Verifica se o email já existe no banco
    const userExists = await db.query('SELECT * FROM barbershops WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'Este email já está em uso.' });
    }

    // Criptografa a senha antes de salvar (MUITO IMPORTANTE)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insere a nova barbearia no banco com is_approved = false por padrão
    const newUser = await db.query(
      'INSERT INTO barbershops (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, passwordHash]
    );

    res.status(201).json({
      message: 'Barbearia registrada com sucesso! Aguardando aprovação do administrador.',
      barbershop: newUser.rows[0],
    });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Função para fazer login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Por favor, forneça email e senha.' });
  }

  try {
    // Procura a barbearia pelo email
    const result = await db.query('SELECT * FROM barbershops WHERE email = $1', [email]);
    const barbershop = result.rows[0];

    if (!barbershop) {
      return res.status(401).json({ message: 'Credenciais inválidas.' }); // Mensagem genérica por segurança
    }

    // Verifica se a conta foi aprovada pelo administrador
    if (!barbershop.is_approved) {
      return res.status(403).json({ message: 'Sua conta ainda está pendente de aprovação.' });
    }

    // Compara a senha fornecida com a senha criptografada no banco
    const isMatch = await bcrypt.compare(password, barbershop.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Se tudo estiver correto, gera um Token JWT
    const payload = {
      id: barbershop.id,
      name: barbershop.name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '24h', // Token expira em 24 horas
    });

    res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token,
    });

  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};