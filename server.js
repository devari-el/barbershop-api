const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');
const authRoutes = require('./routes/auth.routes');
const clientRoutes = require('./routes/client.routes');
const serviceRoutes = require('./routes/service.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const { startNotificationService } = require('./services/notification.service');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Configuração do CORS (A MUDANÇA ESTÁ AQUI) ---
// Lista de endereços que têm permissão para acessar a API
const allowedOrigins = [
  'https://barbershop-frontend-omega.vercel.app',
  // Adicione aqui outros endereços se precisar, como o de desenvolvimento local
  // 'http://127.0.0.1:5500' 
];

const corsOptions = {
  origin: (origin, callback) => {
    // Permite requisições sem 'origin' (como do Postman ou apps mobile) ou da nossa lista
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  }
};

app.use(cors(corsOptions)); // Usa as opções de CORS configuradas

app.use(express.json());

// --- Rotas ---
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);

// --- Iniciar o Servidor e Serviços ---
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  startNotificationService();
});
