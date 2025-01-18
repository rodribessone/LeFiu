const express = require('express');
const router = express.Router();
const { getDeliveryPrice, updateDeliveryPrice } = require('../controlador/configControlador');
const { authenticate, authorize } = require('../middleware/auth');

// Ruta para obtener el precio de delivery
router.get('/delivery', getDeliveryPrice);

// Ruta para actualizar el precio de delivery
router.put('/delivery', authenticate, authorize(['admin']), updateDeliveryPrice);

module.exports = router;