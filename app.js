const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded({ extended: false})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(cors())
require('dotenv').config();

const postingsRoutes = require('./routes/postings');
const authRoutes = require('./routes/auth');



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.post('/', (req, res ,next) => {
    console.log(`\nREQUEST BODY:\n${req.body.email}\t${req.body.password}\n\n`);
    next();
})

app.use(postingsRoutes);

app.use('/auth', authRoutes);

//Error handling:
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

console.log(`Server running on port: ${process.env.PORT}`);

mongoose
.connect(
    'mongodb+srv://assd_marketplace-app:TsHMwP2_XwX4vtg@cluster0.e7tof.mongodb.net/Cluster0?retryWrites=true&w=majority'
    )
.then(result => { 
    app.listen(process.env.PORT);
})
.catch(err => {
    console.log(err)
});
