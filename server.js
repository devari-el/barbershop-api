const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');
const authRoutes = require('./routes/auth.routes');
const clientRoutes = require('./routes/client.routes');
const serviceRoutes = require('./routes/service.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const { startNotificationService } = require('./services/notification.service'); // <-- Importa o serviço

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Rotas ---
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);

// --- Iniciar o Servidor e Serviços ---
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  
  // Inicia o serviço de notificação em segundo plano
  startNotificationService();
});