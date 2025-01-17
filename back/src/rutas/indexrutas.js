const express = require('express')
const router = express.Router()
const Productos = require('../controlador/indexcontrolador')
const { authenticate, authorize } = require('../middleware/auth');

router.get("/productos", Productos.getAll)
router.get("/productos/:_id", Productos.getByID)
router.post("/productos", authenticate, authorize(['admin']), Productos.createOne)
router.put("/productos/:_id", authenticate, authorize(['admin']), Productos.modifOne)
router.delete("/productos/:_id", authenticate, authorize(['admin']), Productos.deleteOne)

module.exports = router