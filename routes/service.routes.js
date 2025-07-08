const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Aplica o middleware de verificação de token em todas as rotas de serviços
router.use(verifyToken);

router.post('/', serviceController.createService);
router.get('/', serviceController.getServices);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;