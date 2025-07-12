const { z } = require('zod');

// Schema para o corpo da requisição de registro (/api/auth/register)
const registerSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'O nome é obrigatório.',
    }).min(2, 'O nome deve ter no mínimo 2 caracteres.'),
    
    email: z.string({
      required_error: 'O email é obrigatório.',
    }).email('Formato de email inválido.'),
    
    password: z.string({
      required_error: 'A senha é obrigatória.',
    }).min(6, 'A senha deve ter no mínimo 6 caracteres.'),
  }),
});

// Schema para o corpo da requisição de login (/api/auth/login)
const loginSchema = z.object({
    body: z.object({
        email: z.string({
            required_error: 'O email é obrigatório.',
        }).email('Formato de email inválido.'),

        password: z.string({
            required_error: 'A senha é obrigatória.',
        }),
    }),
});

// Exporta os schemas para serem usados nas rotas
module.exports = {
  registerSchema,
  loginSchema,
};