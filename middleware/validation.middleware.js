const { ZodError } = require('zod');

/**
 * Middleware factory para validar requisições com um schema Zod.
 * @param {z.Schema} schema - O schema do Zod para validação.
 * @returns {Function} Um middleware do Express.
 */
const validate = (schema) => (req, res, next) => {
  try {
    // Valida o body, query e params da requisição contra o schema.
    // Lança um ZodError se a validação falhar.
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      // Erro de validação do cliente (Bad Request).
      return res.status(400).json({
        message: 'Erro de validação nos dados de entrada.',
        errors: error.issues,
      });
    }
    // Erro inesperado no servidor.
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

module.exports = validate;