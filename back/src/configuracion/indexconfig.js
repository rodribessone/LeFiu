const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

async function connectToMongoDB() {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log("Ya estamos conectados a MongoDB.");
            return; // Si ya está conectado, no hacer nada
        }

        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI no está definido en el archivo .env.");
        }

        console.log("Conectando a MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // Para aumentar el tiempo de espera
        });
        console.log("Conectado a MongoDB.");
    } catch (error) {
        console.error("Error al conectar con MongoDB:", error.message);
        throw error; // Relanzar el error para manejarlo correctamente
    }
}

async function disconnectToMongoDB() {
    try {
        await mongoose.disconnect();
        console.log("Desconectado correctamente de MongoDB.");
    } catch (error) {
        console.error("Error al desconectar de MongoDB:", error.message);
    }
}

module.exports = { connectToMongoDB, disconnectToMongoDB };

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