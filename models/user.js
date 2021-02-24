const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type:String
    },
    password: {
        type:String
    },
    name: {
        type: String
    },
    postings: [{
            type: Schema.Types.ObjectId,
            ref: 'Posting'
    }]
});

module.exports = mongoose.model('User', userSchema);