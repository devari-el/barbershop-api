const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  // Lê o token do cookie chamado 'authToken'
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(403).json({ message: 'Nenhum token fornecido. Acesso negado.' });
  }

  try {
    // Verifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Adiciona o ID do usuário à requisição para uso posterior
    req.barbershopId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }};