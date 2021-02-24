const { validationResult } = require('express-validator/check');

const Posting = require('../models/posting');
const Image = require('../models/images');


// exports.uploadImage = (req,res,next) => {
//     if(!req.file){
//         const error = new Error('No file picked.');
//         error.statusCode = 422;
//         throw error;
//     }
// }

// exports.deleteImage = (req, res, next) => {
//     if(!req.file){
//         const error = new Error('No file picked.');
//         error.statusCode = 422;
//         throw error;
//     }
// }

exports.postImage = (req, res, next) => {
    console.log(req.body);
    if (!errors.isEmpty()){
        const error = new Error('Validation failed, entered data incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.url
    const image = new Image({
        image: imageUrl,
        postingId: req.postingId
    });
    image
        .save()
        .then(result => {
            return Posting.findById(req.postingId);
        })
        .then(posting => {
            //if(posting.imageUrl.count < 3)
            posting.imageUrl.push(imageUrl);
            return posting.save();
        })
        .then(result => {
            res.status(201).json({ 
                message: 'New image added to posting succesfully!',
                image: image,
                posting: posting
            })
        })
        .catch(err => { 
            if (!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });  
};