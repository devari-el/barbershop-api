const express = require('express');
const router = express.Router();

// Importa o middleware de verificação de token
const { verifyToken } = require('../middleware/auth.middleware');

// Importa todos os arquivos de rota individuais
const authRoutes = require('./auth.routes');
const clientRoutes = require('./client.routes');
const serviceRoutes = require('./service.routes');
const appointmentRoutes = require('./appointment.routes');

// --- Rotas Públicas ---
// O grupo de rotas de autenticação (/api/auth) não precisa do token
router.use('/auth', authRoutes);


// --- Rotas Protegidas ---
// A partir daqui, todas as rotas definidas abaixo exigirão um token válido.
// O middleware verifyToken é aplicado a todas elas de uma só vez.
router.use(verifyToken);

router.use('/clients', clientRoutes);
router.use('/services', serviceRoutes);
router.use('/appointments', appointmentRoutes);


module.exports = router;