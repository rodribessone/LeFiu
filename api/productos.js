const Productos = require('../back/src/controlador/indexcontrolador');
const { connectToMongoDB, disconnectToMongoDB } = require('../back/src/configuracion/indexconfig');

// Función serverless que maneja las rutas de productos
module.exports = async (req, res) => {
  // Conectar a la base de datos antes de manejar la solicitud
  await connectToMongoDB();
  
  // Rutas de productos
  if (req.method === 'GET') {
    if (req.query._id) {
      // Obtener producto por ID
      await Productos.getByID(req, res);
    } else {
      // Obtener todos los productos
      await Productos.getAll(req, res);
    }
  } else if (req.method === 'POST') {
    // Crear un nuevo producto
    await Productos.createOne(req, res);
  } else if (req.method === 'PUT') {
    // Modificar un producto
    await Productos.modifOne(req, res);
  } else if (req.method === 'DELETE') {
    // Eliminar un producto
    await Productos.deleteOne(req, res);
  } else {
    // Si el método no es soportado, devolver 405 (Método no permitido)
    res.status(405).json({ error: 'Método no permitido' });
  }

  // Desconectar después de manejar la solicitud
  await disconnectToMongoDB();
};