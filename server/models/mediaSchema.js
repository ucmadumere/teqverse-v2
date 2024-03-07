const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const mediaSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },

    blogCategory: {
        type: String,
        enum: ['Software Development', 'Artificial Intelligence', 'Product Management', 'Cybersecurity'],
        require: true
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('mediablog', mediaSchema);

