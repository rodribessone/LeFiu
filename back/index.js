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

// Conexión a MongoDB
connectToMongoDB();

// Middleware de CORS (configurado correctamente)
const corsOptions = {
    origin: 'https://le-fiu.vercel.app', // Permite solicitudes solo desde tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Si necesitas permitir cookies o autenticación
};

app.use(cors(corsOptions));  // Añadir CORS aquí

// Configuración de body-parser
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