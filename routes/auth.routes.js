const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Rotas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Rota protegida para obter dados do usuário logado
router.get('/me', verifyToken, authController.getMe);

module.exports = router;