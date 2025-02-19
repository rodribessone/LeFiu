const express = require('express');
const app = express();
const path = require('path'); // Para trabajar con rutas de archivos
const rutas = require('./src/rutas/indexrutas');
const usuarioRutas = require('./src/rutas/usuarioRutas');
const configRutas = require('./src/rutas/configRutas');
const rutasHamburguesas = require('./src/rutas/rutasHamburguesas');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToMongoDB, disconnectToMongoDB } = require('./src/configuracion/indexconfig');

dotenv.config();

// Conectar a MongoDB
connectToMongoDB();

app.use(express.json());

// Configuración de CORS
app.use(
  cors({
    origin: 'https://le-fiu.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(bodyParser.json());

// **Monta primero todas las rutas antes del `app.get('*')`**
app.use("/", rutas);
app.use("/", usuarioRutas);
app.use("/", configRutas);
app.use("/", rutasHamburguesas);

// **Ahora define la ruta catch-all para archivos estáticos**
// app.use(express.static(path.join(__dirname, 'build')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// Iniciar el servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});

// Manejo del cierre del servidor
process.on('SIGINT', async () => {
  console.log('Cerrando el servidor...');
  await disconnectToMongoDB();
  process.exit(0);
});
