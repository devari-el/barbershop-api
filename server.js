const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const db = require('./db');
// 1. Deve ter a importação do roteador principal
const mainRouter = require('./routes/index'); 
const { startNotificationService } = require('./services/notification.service');
// 2. E também a importação do nosso novo handler de erro
const errorHandler = require('./middleware/error.middleware'); 

const app = express();
const PORT = process.env.PORT || 3001;

// --- Configuração do CORS ---
// Middleware de CORS manual para controle explícito dos cabeçalhos
app.use((req, res, next) => {
    // Define as origens permitidas
    const allowedOrigins = [
        'https://barbershop-frontend-omega.vercel.app',
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ];
    const origin = req.headers.origin;

    // Permite a origem se ela estiver na lista
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    // Define outros cabeçalhos de CORS necessários
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Responde imediatamente às requisições pre-flight (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// --- Rotas ---
app.get('/', (req, res) => {
    res.status(200).json({ status: 'API is running and ready!' });
});
// 3. Deve usar o roteador principal
app.use('/api', mainRouter);

// --- Middleware de Tratamento de Erros ---
// 4. E também o handler de erro no final
app.use(errorHandler);

// --- Iniciar o Servidor e Serviços ---
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    startNotificationService();
  });
}

module.exports = app;
