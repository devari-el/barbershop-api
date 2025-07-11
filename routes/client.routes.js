const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const { verifyToken } = require('../middleware/auth.middleware'); // Importa o middleware

// 1. Importa o middleware e o schema de cliente
const validate = require('../middleware/validation.middleware');
const { clientSchema } = require('../schemas/client.schema');

// Aplica o middleware verifyToken em TODAS as rotas deste arquivo.
// Qualquer requisição para /api/clients/* precisará de um token válido.
router.use(verifyToken);

router.post('/', validate(clientSchema), clientController.createClient);
router.get('/', clientController.getClients);
router.put('/:id', validate(clientSchema), clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;