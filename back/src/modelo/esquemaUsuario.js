const { connectToMongoDB } = require('../configuracion/indexconfig');
const mongoose = require('mongoose');

class UsuariosModel {
  static async createOne(user) {
    try {
      const clientMongoDB = await connectToMongoDB();
      if (!clientMongoDB) {
        throw new Error('Error al conectar con MongoDB');
      }

      // Asegurarte de que siempre tenga un role (por defecto "usuario")
      const newUser = { ...user, role: user.role || 'usuario' };

      const resultado = await clientMongoDB.db('LeFiu').collection('usuarios').insertOne(newUser);
      if (resultado.acknowledged) {
        return { data: { ...newUser, _id: resultado.insertedId }, error: false };
      }
      return { error: true, data: null };
    } catch (error) {
      console.error(error);
      return { error: true, message: error.message };
    }
  }

  static async findOne(query) {
    try {
      const clientMongoDB = await connectToMongoDB();
      if (!clientMongoDB) {
        throw new Error('Error al conectar con MongoDB');
      }

      const resultado = await clientMongoDB.db('LeFiu').collection('usuarios').findOne(query);
      if (!resultado) {
        return { data: null, error: true };
      }
      return { data: resultado, error: false };
    } catch (error) {
      console.error(error);
      return { error: true, message: error.message };
    }
  }
}

module.exports = UsuariosModel;