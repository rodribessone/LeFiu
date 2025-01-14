const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');

let client = null; // Cliente reutilizable

async function connectToMongoDB() {
    try {
        // Si ya existe un cliente conectado, reutilízalo
        if (client && client.topology && client.topology.isConnected()) {
            console.log("Ya estamos conectados a MongoDB.");
            return client;
        }

        // Validar que el URI de conexión esté definido
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI no está definido en el archivo .env.");
        }

        // Crear una nueva conexión
        console.log("Conectando a MongoDB...");
        client = new MongoClient(process.env.MONGODB_URI);

        await client.connect();
        console.log("Conectado a MongoDB.");
        return client;
    } catch (error) {
        console.error("Error al conectar con MongoDB:", error.message);
        client = null; // Reiniciar cliente en caso de error
        throw error; // Relanzar el error para manejarlo en los métodos
    }
}

async function disconnectToMongoDB() {
    if (client) {
        try {
            await client.close();
            console.log("Desconectado correctamente de MongoDB.");
        } catch (error) {
            console.error("Error al desconectar de MongoDB:", error.message);
        } finally {
            client = null; // Asegurarse de reiniciar el cliente
        }
    } else {
        console.log("No hay conexión activa para cerrar.");
    }
}

module.exports = { connectToMongoDB, disconnectToMongoDB };