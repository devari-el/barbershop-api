const { z } = require('zod');

// Schema para validar o corpo da requisição ao criar ou atualizar um cliente.
// Usaremos o mesmo schema para ambas as operações (POST e PUT),
// pois os campos obrigatórios são os mesmos.
const clientSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'O nome do cliente é obrigatório.',
    }).min(3, 'O nome do cliente deve ter no mínimo 3 caracteres.'),
    
    phone_number: z.string({
      required_error: 'O número de telefone é obrigatório.',
    }).min(10, 'O número de telefone deve ter no mínimo 10 dígitos (DDD + número).'),
  }),
});

// Exporta o schema para ser utilizado nas rotas de cliente.
module.exports = {
  clientSchema,
};
