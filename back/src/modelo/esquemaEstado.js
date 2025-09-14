const { connectToMongoDB } = require('../configuracion/indexconfig');

class EstadoModel {
  static async getEstado() {
    const client = await connectToMongoDB();
    const result = await client.db('LeFiu').collection('estado').findOne({});
    if (!result) {
      return { data: { abierto: false }, error: false }; // por defecto cerrado
    }
    return { data: result, error: false };
  }

  static async updateEstado(abierto) {
    const client = await connectToMongoDB();
    const result = await client.db('LeFiu').collection('estado').findOneAndUpdate(
      {},
      { $set: { abierto } },
      { upsert: true, returnDocument: 'after' }
    );
    return { data: result.value, error: false };
  }
}

module.exports = EstadoModel;
