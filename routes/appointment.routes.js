const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.use(verifyToken);

router.post('/', appointmentController.createAppointment);
router.get('/', appointmentController.getAppointments);
router.patch('/:id/cancel', appointmentController.cancelAppointment); // Usamos PATCH para uma atualização parcial (mudar o status)

module.exports = router;