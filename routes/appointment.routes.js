const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// 1. Importa o middleware e o schema de agendamento
const validate = require('../middleware/validation.middleware');
const { createAppointmentSchema } = require('../schemas/appointment.schema');

router.use(verifyToken);

router.post('/', validate(createAppointmentSchema), appointmentController.createAppointment);
router.get('/', appointmentController.getAppointments);
router.patch('/:id/cancel', appointmentController.cancelAppointment);

module.exports = router;
