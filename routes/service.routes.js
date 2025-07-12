const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
// 1. Importa o middleware de validação e o schema de serviço
const validate = require('../middleware/validation.middleware');
const { serviceSchema } = require('../schemas/service.schema');

router.post('/', validate(serviceSchema), serviceController.createService);
router.get('/', serviceController.getServices);
router.put('/:id', validate(serviceSchema), serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;