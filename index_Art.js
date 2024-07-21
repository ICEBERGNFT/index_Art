require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { Client } = require('pg');

app.use(cors({
    origin: 'https://icebergnft.github.io', // Restringe los orígenes permitidos
}));

app.use(express.json());

const db = new Client({
    user: process.env.USER_DB_POSTGRES,
    host: process.env.HOST_DB_POSTGRES,
    database: process.env.DATABASE_DB_POSTGRES,
    password: process.env.PASSWORD_DB_POSTGRES,
    port: process.env.PORT_DB_POSTGRES,
});

db.connect();

app.get("/db_artists",(req,res) => {
    const nameFilter = req.query.name || ''; // Obtener el nombre del query parameter 'name'

    // Consulta SQL para obtener los memes filtrados por nombre y limitar los resultados a 3
    let sqlQuery = '';
    let sqlParams = [];
    
    if (nameFilter !== '') {
        // Si se proporciona un nombre, filtrar por ese nombre y limitar a 3
        sqlQuery = `SELECT * FROM db_artists WHERE name LIKE $1 LIMIT 5`;
        // Añadir '%' al inicio y al final del nombre para realizar una búsqueda parcial
        const namePattern = '%' + nameFilter + '%';
        sqlParams = [namePattern];
    } else {
        // Si el nombre está vacío, devolver los primeros 10 memes
        sqlQuery = `SELECT * FROM db_memes ORDER BY name ASC LIMIT 10`;
    }

    db.query(sqlQuery, sqlParams, (err,result) => {
        if(err){
            console.log(err);
            res.status(500).json({ error: 'Error fetching memes' });
        } else {
            res.send(result.rows);
        }
    });
});

//////////// db pools //////////////




app.get("/artist_0",(req,res) => {

    db.query('SELECT * FROM artist_0', (err,result)=>{

        if(err){
            console.log(err);
        }else{
            res.send(result.rows);
        }
    }
);
});

// Middleware para manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3001,()=>{
    console.log("puerto 3001 XD")
})
