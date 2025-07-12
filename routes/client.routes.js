const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Importa o middleware e o schema de cliente
const validate = require('../middleware/validation.middleware');
const { clientSchema } = require('../schemas/client.schema');

// Aplica o middleware de autenticação em todas as rotas
router.use(verifyToken);

// Aplica o middleware de validação nas rotas de criação e atualização
router.post('/', validate(clientSchema), clientController.createClient);
router.put('/:id', validate(clientSchema), clientController.updateClient);

// Rotas que não precisam de validação de corpo
router.get('/', clientController.getClients);
router.delete('/:id', clientController.deleteClient);

module.exports = router;