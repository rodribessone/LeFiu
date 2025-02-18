const { connectToMongoDB } = require('../configuracion/indexconfig');

class HamburguesaModel {
  static async getHamburguesasPrice() {
    try {
      const client = await connectToMongoDB();
      const resultado = await client.db('LeFiu').collection('hamburguesa').findOne();
      // Debes retornar ambos precios
      return { 
        data: {
          doble: resultado?.doble || 0,
          triple: resultado?.triple || 0
        }, 
        error: false 
      };
    } catch (error) {
      return { data: null, error: true, message: error.message };
    }
  }

  static async updateHamburguesasPrice(price) {
    try {
      const client = await connectToMongoDB();
      if (!client) throw new Error("Error al conectar con MongoDB");
      if (typeof price !== 'number' || price <= 0) {
        return { data: null, error: true, message: 'El precio debe ser un número positivo' };
      }
      const resultado = await client.db('LeFiu').collection('hamburguesa').findOneAndUpdate(
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

module.exports = HamburguesaModel;
