const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');

const Posting = require('../models/posting');
const User = require('../models/user');
const Image = require('../models/images');


exports.getPostings = (req, res, next) => {
    const categoryFilter = req.query.category;
    const locationFilter = req.query.location; 
    //const dateFilter = req.query.date || ;
    
    Posting
    .find()
    .then(postings => {
        const filteredPostings = [];    
        if (categoryFilter){
            filteredPostings.push(postings.filter(p => p.category == categoryFilter));
        }
        if (locationFilter){
            filteredPostings.push(postings.filter(p => p.location.city == locationFilter));
        }
        if (filteredPostings.length == 0){
            filteredPostings.push([...postings]);
        }
        console.log(postings);
        res
        .status(200)
        .json({ message: 'Fetched postings succesfully.', postings: filteredPostings});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
    // Posting.find()
    // .then(postings => {
    //     res
    //     .status(200)
    //     .json({ message: 'Fetched postings succesfully', postings: postings});
    // })
    // .catch(err => {
    //     if(!err.statusCode){
    //         err.statusCode = 500;
    //     }
    //     next(err);
    // });
}

exports.postPosting = (req, res, next) => {
    const errors = validationResult(req);
    console.log(req.body);
    if (!errors.isEmpty()){
        const error = new Error('Validation failed, entered data incorrect.');
        error.statusCode = 422;
        throw error;
    }
    
    const title = req.body.title;
    const description = req.body.description;
    const category = req.body.category;
    const location = req.body.location;
    const askingPrice = req.body.askingPrice;
    const deliveryType = req.body.deliveryType;
    let seller;
    
    const posting = new Posting({
        title: title, 
        description: description, 
        category: category,
        location: location,
        imageUrl: [],
        askingPrice: askingPrice,
        deliveryType: deliveryType,
        seller: req.userId
    });
    posting
        .save()
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            seller = user;
            user.postings.push(posting);
            return user.save();
            
        })
        .then(result => {
            res.status(201).json({ 
                message: 'New posting created succesfully!',
                posting: posting,
                seller: { _id: seller._id, name: seller.name }
            })
        })
        .catch(err => { 
            if (!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
    });
};

exports.getPosting = (req, res, next) => {
    const postingId = req.params.postingId;
    Posting.findById(postingId)
    .then(posting => {
        if(!posting){
            const error = new Error('Could not find posting.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Posting fetched.', posting: posting });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}
exports.patchImageToPosting = (req, res, next) => {
    console.log(req.file);
    console.log(req.file.url);
    console.log(req.file.public_id);
    const imageUrl = req.file.url;
    const cloudinaryPublicId = ref.file.public_id;
    const postingId = req.params.postingId;
    let postingRef;
    const image = new Image({
        imageUrl: imageUrl,
        cloudinaryPublicId: cloudinaryPublicId,
        postingRef: req.postingId 
    });
    image
    .save()
    .then(result => {
        return Posting.findById(postingId)})
    .then(posting => {
        if(!posting){
            const error = new Error('Could not find posting.');
            error.statusCode = 404;
            throw error;
        }
        // if(posting.imageUrl.length > 3){
        //     res.json({ message: 'Maximum amount of pictures is three.'});
        //     return;
        //  }
        posting.imageUrl.push(imageUrl);
        console.log(posting);
        return posting.save();
    })
    .then(result => {
        console.log(res.body);
        res.status(200).json({ message: 'Posting updated!', posting: result });
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
    }

exports.updatePosting = (req, res, next) => {
    const postingId = req.params.postingId;
    const title = req.body.title;
    const description = req.body.description;
    const category = req.body.category;
    const location = req.body.location;
    const images = req.body.images;
    const askingPrice = req.body.askingPrice;
    const deliveryType = req.body.deliveryType;
    if (!errors.isEmpty()){
        const error = new Error('Validation failed, entered data incorrect.');
        error.statusCode = 422;
        throw error;
    }
    if(req.file) {
        images.imageUrl = req.file.path;
    }
    if(!imageUrl){
        const error = new Error('No file picked.');
        error.statusCode = 422;
        throw error;
    }
    Posting.findById(postingId)
    .then(posting => {
        if(!posting){
            const error = new Error('Could not find posting.');
            error.statusCode = 404;
            throw error;
        }
        if(post.seller.toString() !== req.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        if (imageUrl !== posting.images.imageUrl){
            clearImage(posting.images.imageUrl)
        }
        posting.title = title;
        posting.description = description;
        posting.category = category;
        posting.location = location;
        posting.images = images;
        posting.askingPrice = askingPrice;
        posting.deliveryType = deliveryType;
        return posting.save();
    })
    .then(result => {
        res.status(200).json({ message: 'Posting updated!', posting: result });
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });

};

exports.deletePosting = (req, res, next) => {
    const postingId = req.param.postingId;
    Posting.findById(postingId)
    .then(posting => {
        if(!posting){
            const error = new Error('Could not find posting.');
            error.statusCode = 404;
            throw error;
        }
        if(post.seller.toString() !== req.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        posting.imageUrl.forEach(imageUrl => clearImage(imageUrl));
        return Posting.findByIdAndRemove(postingId);
    })
    .then(result => {
        User.findById(req.userId);
    })
    .then(user => {
        user.postings.pull(postingId);
        return user.save();
    })
    .then(result => {
        console.log(result);
        res.status(200).json({ message:'Deleted post.'});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => { console.log(err )});
}
