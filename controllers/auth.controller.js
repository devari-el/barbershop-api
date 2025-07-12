const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  path: '/', // Garante que o cookie é válido para todo o site
};

// Função para registrar uma nova barbearia
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

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

  try {
    const result = await db.query('SELECT * FROM barbershops WHERE email = $1', [email]);
    const barbershop = result.rows[0];

    if (!barbershop || !barbershop.is_approved) {
      return res.status(401).json({ message: 'Credenciais inválidas ou conta não aprovada.' });
    }

    const isMatch = await bcrypt.compare(password, barbershop.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const payload = { id: barbershop.id, name: barbershop.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.cookie('authToken', token, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000, // 1 dia
    });

    res.status(200).json({ message: 'Login bem-sucedido!' });

  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Função para fazer logout
exports.logout = (req, res) => {
  res.cookie('authToken', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ message: 'Logout bem-sucedido!' });
};

// Função para obter os dados do usuário logado
exports.getMe = async (req, res) => {
    const barbershopId = req.barbershopId;
    try {
        const result = await db.query('SELECT id, name, email FROM barbershops WHERE id = $1', [barbershopId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};
