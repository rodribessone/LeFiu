const express = require('express');
const router = express.Router();
const { getEstado, updateEstado } = require('../controlador/estadoControlador');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/estado', getEstado);
router.put('/estado', authenticate, authorize(['admin']), updateEstado);

module.exports = router;
