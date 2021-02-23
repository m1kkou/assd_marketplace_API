const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const app = express();


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: '',
    allowedFormats: ['jpg', 'jpeg', 'png'],
});


//const parser = multer({ storage: storage });

// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//         console.log(file);
//     }
// });

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const postingsRoutes = require('./routes/postings');
const authRoutes = require('./routes/auth');

app.get('/', (req, res, next) => {
    console.log(req.body);
    next();
})
app.use(bodyParser.json());
app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'));
// app.use('/images', parser.single('image'), function (req,res) {
//     res.json(req.file)
// });

//app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});



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
