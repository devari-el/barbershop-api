const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const db = require('./db');
const mainRouter = require('./routes/index');
const { startNotificationService } = require('./services/notification.service');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Configuração do CORS ---
const corsOptions = {
  origin: [
    'https://barbershop-frontend-omega.vercel.app',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// --- Rotas ---
app.get('/', (req, res) => {
    res.status(200).json({ status: 'API is running and ready!' });
});
app.use('/api', mainRouter);

// --- Iniciar o Servidor e Serviços ---
// Apenas inicia o servidor e os serviços se não estiver em ambiente de teste
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    // A linha abaixo foi movida para dentro do 'if'
    startNotificationService();
  });
}

// Exporta o app para ser usado nos testes
module.exports = app;