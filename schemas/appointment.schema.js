const { z } = require('zod');

// Schema para validar o corpo da requisição ao criar um novo agendamento.
const createAppointmentSchema = z.object({
  body: z.object({
    // Valida que o client_id é um número.
    // O front-end envia o ID como string, então usamos z.coerce para converter.
    client_id: z.coerce.number({
        required_error: 'O cliente é obrigatório.',
        invalid_type_error: 'O ID do cliente deve ser um número.',
    }),

    // Valida que o service_id é um número.
    service_id: z.coerce.number({
        required_error: 'O serviço é obrigatório.',
        invalid_type_error: 'O ID do serviço deve ser um número.',
    }),

    // Valida que a data e hora do agendamento é uma string em formato de data/hora ISO 8601.
    // Ex: "2025-07-10T14:30:00.000Z"
    appointment_time: z.string({
      required_error: 'A data e hora do agendamento são obrigatórias.',
    }).datetime({ message: 'Formato de data e hora inválido.' }),
  }),
});

module.exports = {
  createAppointmentSchema,
};
