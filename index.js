require('dotenv').config();
const express = require('express');

const cors = require('cors');

const { dbConnection } = require('./database/config');

// creacion de expres
const app = express();

// configurar cors
app.use(cors());

// lectura y parseo del body
app.use(express.json());

// base de datos
dbConnection();

// rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'))

app.listen(process.env.PORT, () => {
    console.log('Servidor ok ' + process.env.PORT);
});