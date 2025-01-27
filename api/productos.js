export default async function handler(req, res) {
    console.log("Iniciando la función...");
    try {
      // Conectar a MongoDB
      const client = await connectToMongoDB();
      console.log("Conexión a MongoDB exitosa");
  
      if (req.method === 'GET') {
        if (req.query._id) {
          console.log("Buscando producto por ID...");
          await Productos.getByID(req, res);
        } else {
          console.log("Buscando todos los productos...");
          await Productos.getAll(req, res);
        }
      } else if (req.method === 'POST') {
        console.log("Creando nuevo producto...");
        await Productos.createOne(req, res);
      } else if (req.method === 'PUT') {
        console.log("Modificando producto...");
        await Productos.modifOne(req, res);
      } else if (req.method === 'DELETE') {
        console.log("Eliminando producto...");
        await Productos.deleteOne(req, res);
      } else {
        console.log("Método no permitido");
        res.status(405).json({ error: 'Método no permitido' });
      }
  
      // Desconectar de MongoDB
      await disconnectToMongoDB();
    } catch (error) {
      console.error("Error en la función:", error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }