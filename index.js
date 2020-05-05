const express = require('express');
const vm = require('v-response');
const morgan = require('morgan');
const cors =  require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Añadiendo Endpoints de la Api
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const ownerRoutes = require('./routes/owner');
dotenv.config();

//Iniciando nuestra instancia del servidor
const app = express();

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser : true, useUnifiedTopology : true, useFindAndModify: false}, err => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connect to MongoDb');
    }
})
//---MIDDLEWARES---
//Utilizando el modulo morgan que funciona para mostrar en la terminal lo que nos envia el cliente 
app.use(morgan('dev'));
app.use(cors());
app.use(express.static('public')); // using the static middleware to serve static files.
//Utilizando el modulo de body-parser para que el servidor reciba correctamente los datos que se envian desde el cliente
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.get("/", (req, res) => {
    res.send("Bienvenido a la api")
})
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);
app.use('/api', ownerRoutes);

const host = process.env.HOST|| '0.0.0.0';
const port = process.env.PORT || 3003;
app.listen(port, host, vm.log( tag= "Listing on port", `http://localhost:${port}`));
