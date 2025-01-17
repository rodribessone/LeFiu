const express = require('express');
const router = express.Router();
const Usuarios = require('../controlador/controladorUsuario');

// Rutas de usuarios
router.post('/register', Usuarios.register);
router.post('/login', Usuarios.login);

module.exports = router;