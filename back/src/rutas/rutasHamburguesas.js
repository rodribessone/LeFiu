const express = require('express');
const router = express.Router();
const { getHamburguesasPrice, updateHamburguesasPrice } = require('../controlador/hamburguesasControlador');
const { authenticate, authorize } = require('../middleware/auth');

// Ruta para obtener el precio extra para tipos de hamburguesa
router.get('/hamburguesa', getHamburguesasPrice);

// Ruta para actualizar el precio extra para tipos de hamburguesa
router.put('/hamburguesa', authenticate, authorize(['admin']), updateHamburguesasPrice);

module.exports = router;
