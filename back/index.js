const express = require('express')
const app = express()
const rutas = require('./src/rutas/indexrutas')
const usuarioRutas = require('./src/rutas/usuarioRutas');
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors')
const { connectToMongoDB, disconnectToMongoDB } = require('./src/configuracion/indexconfig'); // Importamos la configuración de MongoDB
dotenv.config()


const PORT = process.env.PORT || 3000

// Intentamos conectar a MongoDB cuando arranca el servidor
connectToMongoDB();

app.use(express.json())

//middleware para evitar el CORPS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permitir cualquier origen
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Métodos permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Encabezados permitidos
    res.setHeader('Access-Control-Allow-Credentials', true); // Permitir el uso de cookies y credenciales
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); // Responder rápidamente a las solicitudes OPTIONS (preflight request)
    }
    next();
})

app.use(cors())
app.use(bodyParser.json())

app.use("/", rutas)
app.use('/', usuarioRutas);

app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}`)
})

// Cerrar la conexión al apagar el servidor
process.on('SIGINT', async () => {
    console.log('Cerrando el servidor...');
    await disconnectToMongoDB();
    process.exit(0); // Terminamos el proceso
});