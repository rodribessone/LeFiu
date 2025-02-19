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

  static async updateHamburguesaPrices(prices) {
    try {
      const client = await connectToMongoDB();
      if (!client) throw new Error("Error al conectar con MongoDB");
  
      const { doble, triple } = prices;
      if (
        typeof doble !== 'number' || doble <= 0 ||
        typeof triple !== 'number' || triple <= 0
      ) {
        return { data: null, error: true, message: 'Los precios deben ser números positivos' };
      }
  
      const resultado = await client.db('LeFiu').collection('hamburguesa').findOneAndUpdate(
        {},
        { $set: { doble, triple } },
        { upsert: true, returnDocument: 'after' }
      );
      if (!resultado.value) {
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
