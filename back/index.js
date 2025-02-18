const express = require('express');
const app = express();
const path = require('path'); // Para trabajar con rutas de archivos
const rutas = require('./src/rutas/indexrutas');
const usuarioRutas = require('./src/rutas/usuarioRutas');
const configRutas = require('./src/rutas/configRutas'); // Ruta para el precio de delivery
const rutasHamburguesas = require('./src/rutas/rutasHamburguesas');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToMongoDB, disconnectToMongoDB } = require('./src/configuracion/indexconfig');

dotenv.config();

// Conectamos a MongoDB
connectToMongoDB();

app.use(express.json());

// Configuración del middleware de CORS
app.use(
  cors({
    origin: 'https://le-fiu.vercel.app/', // Dominio del frontend permitido
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(bodyParser.json());

// Montamos las rutas en la raíz
app.use("/", rutas);
app.use("/", usuarioRutas);
app.use("/", configRutas);
app.use("/", rutasHamburguesas);

// Sirve los archivos estáticos del build del frontend
app.use(express.static(path.join(__dirname, 'build')));

// Ruta catch-all para el frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});

process.on('SIGINT', async () => {
  console.log('Cerrando el servidor...');
  await disconnectToMongoDB();
  process.exit(0);
});
