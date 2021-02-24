const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema(
    { 
    imageUrl: {
        type: String,
        required: true
    },
    posting: {
        type: Schema.Types.ObjectId,
        ref: 'Posting',
        required: true
    }
}, { timestamps: true}
);

module.exports = mongoose.model('Image', imageSchema);