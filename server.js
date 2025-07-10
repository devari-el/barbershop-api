const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const db = require('./db');
const authRoutes = require('./routes/auth.routes');
const clientRoutes = require('./routes/client.routes');
const serviceRoutes = require('./routes/service.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const { startNotificationService } = require('./services/notification.service');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Configuração do CORS ---
// Define explicitamente qual site (origem) tem permissão.
const corsOptions = {
  origin: [
    'https://barbershop-frontend-omega.vercel.app', // URL de produção
    'http://127.0.0.1:5500'                        // URL do Live Server para testes locais
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Permite que o frontend envie o token de autorização.
  optionsSuccessStatus: 204
};

// Usa o middleware cors com as nossas opções.
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

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