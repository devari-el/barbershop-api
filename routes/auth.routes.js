const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Rota para registrar uma nova barbearia
router.post('/register', authController.register);

// Rota para fazer login
router.post('/login', authController.login);

module.exports = router;