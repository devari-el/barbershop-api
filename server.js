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
// Abordagem final e mais explícita para garantir a compatibilidade.
const allowedOrigins = ['https://barbershop-frontend-omega.vercel.app'];

const corsOptions = {
  origin: (origin, callback) => {
    // Permite requisições da nossa lista ou sem origem (Postman, etc)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204
};

// Primeiro, usamos o middleware cors com as opções.
app.use(cors(corsOptions));

// Segundo, garantimos que as requisições OPTIONS sejam tratadas.
// Esta é uma camada extra de segurança para o erro de preflight.
app.options('*', cors(corsOptions));

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