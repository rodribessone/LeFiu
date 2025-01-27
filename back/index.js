const express = require('express');
const app = express();
const rutas = require('./src/rutas/indexrutas');
const usuarioRutas = require('./src/rutas/usuarioRutas');
const configRutas = require('./src/rutas/configRutas'); // Nueva ruta para el precio de delivery
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToMongoDB, disconnectToMongoDB } = require('./src/configuracion/indexconfig'); // Configuración de MongoDB
dotenv.config();

// const PORT = process.env.PORT || 3000;

connectToMongoDB();

app.use(express.json());

// Configuración del middleware de CORS
app.use(
    cors({
      origin: 'https://le-fiu.vercel.app', // Dominio del frontend permitido
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
      allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
      credentials: true, // Permitir cookies/sesiones si es necesario
    })
  );

app.use(bodyParser.json());

app.use("/", rutas);
app.use('/', usuarioRutas);
app.use('/', configRutas); // Ruta agregada para el precio de delivery

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});

process.on('SIGINT', async () => {
    console.log('Cerrando el servidor...');
    await disconnectToMongoDB();
    process.exit(0);
});