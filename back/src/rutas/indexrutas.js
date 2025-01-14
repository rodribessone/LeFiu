const express = require('express')
const router = express.Router()
const Productos = require('../controlador/indexcontrolador')

router.get("/productos", Productos.getAll)
router.get("/productos/:_id", Productos.getByID)
router.post("/productos", Productos.createOne)
router.put("/productos/:_id", Productos.modifOne)

module.exports = router