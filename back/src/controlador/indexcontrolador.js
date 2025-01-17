const ProductosModel = require('../modelo/indexmodelo')
const ProductSchema = require('../modelo/esquemaproducto')
const mongoose = require('mongoose')

class Productos{
    static async getAll(req, res){
       const {data, error} = await ProductosModel.getAll()
       error ? res.status(400).json({error: "No hay productos"})
             : res.status(200).json(data)
    }

    static async getByID(req, res){
      const {_id} = req.params
      if(!_id || !mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({error: 'No se proporciono un ID valido'})
      const {data, error} = await ProductosModel.getByID(_id)
      error ? res.status(400).json({error: "No existe el producto"})
            : res.status(200).json(data)
    }

    static async createOne(req, res){
      const body = req.body
      try {
        const producto = ProductSchema.parse(body)
        const {data, error} = await ProductosModel.createOne(producto)
        if (data) return res.status(202).json(data)
      } catch (error) {
        res.status(400).json({error: 'Los datos enviados son incorrectos'})
      }
    }

    static async deleteOne(req, res){
      const { _id } = req.params;

      // Valida que el ID sea válido
      if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ error: 'ID no válido' });
      }

      try {
        const { data, error, message } = await ProductosModel.deleteOne(_id)
        if (error) {
          return res.status(404).json({ error: message || 'No se pudo eliminar el producto' });
        }
        return res.status(200).json({ message: 'Producto eliminado correctamente', data });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
    }

    static async modifOne(req, res){
      const body = req.body
      const {_id} = req.params

      if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ error: 'ID no válido' });
      }

      try {
        const { data, error, message } = await ProductosModel.updateOne(_id, body);
        if (error) {
            return res.status(404).json({ error: message || 'No se pudo actualizar el producto' });
        }
        res.status(200).json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
}

module.exports = Productos