const express = require('express');
const cors = require('cors'); // Vamos usar a biblioteca novamente
require('dotenv').config();

const db = require('./db');
const authRoutes = require('./routes/auth.routes');
const clientRoutes = require('./routes/client.routes');
const serviceRoutes = require('./routes/service.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const { startNotificationService } = require('./services/notification.service');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Configuração do CORS (Abordagem Híbrida Final) ---

// 1. Definir as opções explícitas para a biblioteca cors.
//    Especificamos exatamente de onde o pedido pode vir.
const corsOptions = {
  origin: 'https://barbershop-frontend-omega.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// 2. Lidar com a "sondagem" (preflight) ANTES de qualquer outra coisa.
//    Isto diz ao Express para usar as nossas opções de CORS para responder
//    especificamente aos pedidos OPTIONS em todas as rotas.
app.options('*', cors(corsOptions));

// 3. Usar o middleware cors para todas as outras requisições (GET, POST, etc.).
app.use(cors(corsOptions));


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