const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  // O token geralmente é enviado no cabeçalho 'Authorization' como 'Bearer TOKEN'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Nenhum token fornecido. Acesso negado.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
    // Adiciona os dados do usuário decodificados (payload) ao objeto da requisição
    req.barbershopId = decoded.id;
    next(); // Passa para a próxima função (o controller da rota)
  });
};