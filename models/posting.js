const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postingSchema = new Schema(
    {
    title: {
        type: String
        //required: true
    },
    description: {
        type: String
        //required: true
    },
    category: {
        type:String
        //required: true
    },
    location: {
        street: {type: String},
        city: {type: String},
        type: Object
        //required: true
    },
    imageUrl: [
        String
    ],
    askingPrice: {
        type: Number
        //required: true
    },
    deliveryType: {
        1: {type: String, default: 'Hakemalla'},
        2: {type: String, default: 'Heittämällä'},
        //required: true
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true}
);

module.exports = mongoose.model('Posting', postingSchema);