const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// 1. Importa o middleware de validação e os schemas
const validate = require('../middleware/validation.middleware');
const { registerSchema, loginSchema } = require('../schemas/auth.schema');

// --- Rotas Públicas ---
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);

// --- Rota Protegida ---
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
