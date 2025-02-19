const { connectToMongoDB } = require('../configuracion/indexconfig'); // Solo importar la función de conexión
const mongoose = require('mongoose');

class DeliveryModel {
  static async getDeliveryPrice() {
    let clientMongoDB;
    try {
      // Conectar automáticamente a MongoDB
      clientMongoDB = await connectToMongoDB();
      if (!clientMongoDB) {
        throw new Error('Error al conectar con MongoDB');
      }

      // Buscar el precio de delivery en la colección 'delivery'
      const resultado = await clientMongoDB.db('LeFiu').collection('delivery').findOne();

      if (!resultado || !resultado.price) {
        return { data: null, error: true, message: 'Precio de delivery no encontrado' };
      }

      return { data: resultado, error: false };
    } catch (error) {
      console.error(error);
      return { data: null, error: true, message: error.message };
    }
  }

  static async updateDeliveryPrice(price) {
    let clientMongoDB;
    try {
      clientMongoDB = await connectToMongoDB();
      if (!clientMongoDB) {
        throw new Error('Error al conectar con MongoDB');
      }
      // Verificar que el precio sea válido
      if (typeof price !== 'number' || price <= 0) {
        return { data: null, error: true, message: 'El precio debe ser un número positivo' };
      }
  
      // Actualizar el precio en la colección 'delivery'
      const resultado = await clientMongoDB.db('LeFiu').collection('delivery').findOneAndUpdate(
        {},
        { $set: { price } },
        { upsert: true, returnOriginal: false } // en lugar de returnDocument: 'after'
      );
  
      // Solo verificamos que se obtuvo un documento actualizado
      if (!resultado.value) {
        return { data: null, error: true, message: 'No se pudo actualizar el precio de delivery correctamente' };
      }
  
      return { data: resultado.value, error: false };
    } catch (error) {
      console.error(error);
      return { data: null, error: true, message: error.message };
    }
  }
  
  
}

module.exports = DeliveryModel;