const { z } = require('zod');

// Schema para validar o corpo da requisição ao criar ou atualizar um serviço.
const serviceSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'O nome do serviço é obrigatório.',
    }).min(3, 'O nome do serviço deve ter no mínimo 3 caracteres.'),
    
    // Usamos z.coerce.number para converter o valor para número antes de validar.
    // Isso é útil porque dados de formulários HTML podem chegar como strings.
    duration_minutes: z.coerce.number({
        required_error: 'A duração é obrigatória.',
        invalid_type_error: 'A duração deve ser um número.',
    }).int('A duração deve ser um número inteiro.').positive('A duração deve ser um número positivo.'),
  }),
});

module.exports = {
  serviceSchema,
};
