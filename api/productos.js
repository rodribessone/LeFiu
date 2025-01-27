import { connectToMongoDB, disconnectToMongoDB } from '../../back/src/configuracion/indexconfig';
import Productos from '../../back/src/controlador/indexcontrolador';

export default async function handler(req, res) {
  try {
    // Conectar a MongoDB
    const client = await connectToMongoDB();

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
      // Si el método no es soportado
      res.status(405).json({ error: 'Método no permitido' });
    }

    // Desconectar de MongoDB
    await disconnectToMongoDB();
  } catch (error) {
    console.error('Error al manejar la solicitud:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}