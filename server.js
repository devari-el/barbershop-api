const express = require('express');
// const cors = require('cors'); // Não vamos mais usar a biblioteca
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
// Criamos o nosso próprio middleware para ter controlo total sobre os cabeçalhos.
app.use((req, res, next) => {
  // Permite que qualquer origem aceda à nossa API.
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Define os métodos HTTP permitidos.
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  // Define os cabeçalhos que o front-end pode enviar.
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Se a requisição for uma "sondagem" (OPTIONS), respondemos com OK (204 No Content) imediatamente.
  // Isto é crucial para o erro de "preflight" que estamos a ver.
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next(); // Passa para a próxima etapa (as nossas rotas)
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
  console.log(`Servidor a rodar na porta ${PORT}`);
  startNotificationService();
});