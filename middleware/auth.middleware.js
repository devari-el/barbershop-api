const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  // Lê o token do cookie chamado 'authToken'
  const token = req.cookies.authToken;

  if (!token) {
    // Se não houver cookie, retorna 401 (Não Autorizado)
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  try {
    // Tenta verificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Se for válido, adiciona o ID do usuário à requisição
    req.barbershopId = decoded.id;
    // E permite que a requisição continue
    next();
  } catch (err) {
    // Se o token for inválido ou expirado, retorna 401
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};