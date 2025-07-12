const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
// 1. Importa o middleware e o schema de agendamento
const validate = require('../middleware/validation.middleware');
const { createAppointmentSchema } = require('../schemas/appointment.schema');

router.post('/', validate(createAppointmentSchema), appointmentController.createAppointment);
router.get('/', appointmentController.getAppointments);
router.patch('/:id/cancel', appointmentController.cancelAppointment);

module.exports = router;
