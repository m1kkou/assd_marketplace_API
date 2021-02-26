const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema(
    { 
    imageUrl: {
        type: String,
        required: true
    },
    cloudinaryPublicId: {
        type: String,
        required: true
    }

}, { timestamps: true}
);

module.exports = mongoose.model('Image', imageSchema);