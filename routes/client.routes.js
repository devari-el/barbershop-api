const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const { verifyToken } = require('../middleware/auth.middleware'); // Importa o middleware

// Aplica o middleware verifyToken em TODAS as rotas deste arquivo.
// Qualquer requisição para /api/clients/* precisará de um token válido.
router.use(verifyToken);

router.post('/', clientController.createClient);
router.get('/', clientController.getClients);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;