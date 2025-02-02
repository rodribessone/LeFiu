const express = require('express');
const app = express();
const path = require('path'); // Para trabajar con rutas de archivos
const rutas = require('./src/rutas/indexrutas');
const usuarioRutas = require('./src/rutas/usuarioRutas');
const configRutas = require('./src/rutas/configRutas'); // Nueva ruta para el precio de delivery
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToMongoDB, disconnectToMongoDB } = require('./src/configuracion/indexconfig'); // Configuración de MongoDB

dotenv.config();

// Conectamos a MongoDB
connectToMongoDB();

app.use(express.json());

// Configuración del middleware de CORS
app.use(
  cors({
    origin: 'https://le-fiu.vercel.app/', // Dominio del frontend permitido
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
    credentials: true, // Permitir cookies/sesiones si es necesario
  })
);

app.use(bodyParser.json());

// Montamos las rutas (no se cambia el prefijo, se mantienen en la raíz)
app.use("/", rutas);
app.use('/', usuarioRutas);
app.use('/', configRutas); // Ruta agregada para el precio de delivery

// Sirve los archivos estáticos del build del frontend
// Asegúrate de que la carpeta 'build' es la generada por tu frontend (por ejemplo, React)
app.use(express.static(path.join(__dirname, 'build')));
// Ruta catch-all: para cualquier otra solicitud, se envía el index.html del build
// Esto es lo que soluciona el error 404 al refrescar páginas que no sean la principal
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Iniciamos el servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});

// Manejo de cierre del servidor
process.on('SIGINT', async () => {
  console.log('Cerrando el servidor...');
  await disconnectToMongoDB();
  process.exit(0);
});