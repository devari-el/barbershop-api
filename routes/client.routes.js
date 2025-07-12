const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
// Importa o middleware e o schema de cliente
const validate = require('../middleware/validation.middleware');
const { clientSchema } = require('../schemas/client.schema');
// Aplica o middleware de validação nas rotas de criação e atualização
router.post('/', validate(clientSchema), clientController.createClient);
router.put('/:id', validate(clientSchema), clientController.updateClient);
router.get('/', clientController.getClients);

router.delete('/:id', clientController.deleteClient);

module.exports = router;