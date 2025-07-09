const cron = require('node-cron');
const { Twilio } = require('twilio');
const db = require('../db');

const startNotificationService = () => {
  console.log('Serviço de notificação iniciado. Verificando agendamentos a cada minuto.');

  cron.schedule('* * * * *', async () => {
    console.log(`[${new Date().toLocaleTimeString()}] Executando verificação de lembretes...`);

    try {
      const query = `
        SELECT
          a.id as appointment_id, a.appointment_time,
          c.name as client_name, c.phone_number as client_phone,
          b.name as barbershop_name, b.twilio_account_sid,
          b.twilio_auth_token, b.twilio_phone_number
         FROM appointments a
         JOIN clients c ON a.client_id = c.id
         JOIN barbershops b ON a.barbershop_id = b.id
         WHERE 
           a.status = 'scheduled' AND 
           a.reminder_sent = FALSE AND
           a.appointment_time >= (NOW() + interval '60 minutes') AND
           a.appointment_time < (NOW() + interval '61 minutes')
      `;
      
      const appointmentsToRemind = await db.query(query);

      if (appointmentsToRemind.rows.length === 0) {
        return;
      }

      console.log(`Encontrados ${appointmentsToRemind.rows.length} agendamentos para notificar.`);

      for (const app of appointmentsToRemind.rows) {
        if (!app.twilio_account_sid || !app.twilio_auth_token || !app.twilio_phone_number) {
          console.warn(`Barbearia ${app.barbershop_name} não possui credenciais da Twilio. Pulando.`);
          continue;
        }

        const twilioClient = new Twilio(app.twilio_account_sid, app.twilio_auth_token);
        
        const appointmentTime = new Date(app.appointment_time).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/Sao_Paulo'
        });
        
        const messageBody = `Olá, ${app.client_name}! Lembrete do seu agendamento na ${app.barbershop_name} hoje às ${appointmentTime}.`;

        try {
          const appointmentDate = new Date(app.appointment_time).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'});
          const appointmentTime = new Date(app.appointment_time).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo'});

          // Usa 'contentSid' e 'contentVariables' em vez de 'body'
          await twilioClient.messages.create({
            from: `whatsapp:${app.twilio_phone_number}`,
            to: `whatsapp:${app.client_phone}`,
            // SID do template padrão do Sandbox: "Your appointment is coming up on {{1}} at {{2}}"
            contentSid: 'HX85b62575e6e4ff6129d7cdefef8f983e',
            contentVariables: JSON.stringify({
              1: appointmentDate, // Preenche a variável {{1}}
              2: appointmentTime  // Preenche a variável {{2}}
            })
          });

          console.log(`Lembrete (texto livre) enviado com sucesso para ${app.client_name} (Agendamento ID: ${app.appointment_id})`);

          await db.query('UPDATE appointments SET reminder_sent = TRUE WHERE id = $1', [app.appointment_id]);

        } catch (twilioError) {
          console.error(`Falha ao enviar mensagem da Twilio para o agendamento ${app.appointment_id}:`, twilioError.message);
        }
      }

    } catch (dbError) {
      console.error('Erro ao buscar agendamentos para notificação:', dbError);
    }
  });
};

module.exports = { startNotificationService };