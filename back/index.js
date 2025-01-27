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

// Middleware de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(cors());
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