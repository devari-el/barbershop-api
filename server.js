const express = require('express');
// A biblioteca 'cors' foi removida para usarmos uma abordagem manual.
require('dotenv').config();

const db = require('./db');
const authRoutes = require('./routes/auth.routes');
const clientRoutes = require('./routes/client.routes');
const serviceRoutes = require('./routes/service.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const { startNotificationService } = require('./services/notification.service');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Configuração do CORS Manual (A MUDANÇA ESTÁ AQUI) ---
// Este middleware será o primeiro a ser executado para cada requisição.
app.use((req, res, next) => {
  // Define explicitamente qual origem é permitida.
  // Isso diz ao navegador: "Eu confio no site da Vercel".
  res.setHeader('Access-Control-Allow-Origin', 'https://barbershop-frontend-omega.vercel.app');
  
  // Define os métodos HTTP permitidos.
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  
  // Define os cabeçalhos que o frontend pode enviar na requisição.
  // 'Authorization' é crucial para o nosso token.
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Se a requisição for do tipo OPTIONS (a "sondagem" de segurança),
  // nós respondemos imediatamente com 'OK' (status 204) e encerramos o ciclo.
  // Isto é o mais importante para resolver o erro de "preflight".
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  // Se não for uma requisição OPTIONS, continua para as próximas rotas.
  next();
});


app.use(express.json());

// --- Rotas ---
app.get('/', (req, res) => {
    res.status(200).json({ status: 'API is running and ready!' });
});
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);

// --- Iniciar o Servidor e Serviços ---
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  startNotificationService();
});