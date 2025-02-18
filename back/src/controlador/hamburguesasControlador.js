const { connectToMongoDB } = require('../configuracion/indexconfig');
const mongoose = require('mongoose');

class HamburguesasModel {
  static async getHamburguesasPrice() {
    try {
      const clientMongoDB = await connectToMongoDB();
      if (!clientMongoDB) {
        throw new Error('Error al conectar con MongoDB');
      }

      // Buscar el documento en la colección 'hamburguesa'
      const resultado = await clientMongoDB.db('LeFiu').collection('hamburguesa').findOne();

      if (!resultado || !resultado.price) {
        return { data: null, error: true, message: 'Precio no encontrado' };
      }

      return { data: resultado, error: false };
    } catch (error) {
      console.error(error);
      return { data: null, error: true, message: error.message };
    }
  }

  static async updateHamburguesasPrice(price) {
    try {
      const clientMongoDB = await connectToMongoDB();
      if (!clientMongoDB) {
        throw new Error('Error al conectar con MongoDB');
      }

      if (typeof price !== 'number' || price <= 0) {
        return { data: null, error: true, message: 'El precio debe ser un número positivo' };
      }

      // Actualizar (o crear) el documento en la colección 'hamburguesa'
      const resultado = await clientMongoDB.db('LeFiu').collection('hamburguesa').findOneAndUpdate(
        {},
        { $set: { price } },
        { upsert: true, returnDocument: 'after' }
      );

      if (!resultado.value || !resultado.value.price) {
        return { data: null, error: true, message: 'No se pudo actualizar el precio correctamente' };
      }

      return { data: resultado.value, error: false };
    } catch (error) {
      console.error(error);
      return { data: null, error: true, message: error.message };
    }
  }
}

module.exports = HamburguesasModel;