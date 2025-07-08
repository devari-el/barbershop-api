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

const corsOptions = {
  origin: "*", // Permite pedidos de qualquer origem.
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Métodos permitidos.
  preflightContinue: false,
  optionsSuccessStatus: 204 // Responde com '204 No Content' aos pedidos de sondagem.
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