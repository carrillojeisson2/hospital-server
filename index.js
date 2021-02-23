require('dotenv').config();
const express = require('express');

const cors = require('cors');

const { dbConnection } = require('./database/config');

// creacion de expres
const app = express();

// configurar cors
app.use(cors());

// base de datos
dbConnection();

// rutas
app.get('/', (req, res) => {

    res.json({
        ok: true,
        msg: 'hola mundo'
    })
})

app.listen(process.env.PORT, () => {
    console.log('Servidor ok ' + process.env.PORT);
});