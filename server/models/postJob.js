const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PostJobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        enum: ['hybrid', 'remote', 'onsite']
    },
    jobLocation: {
        type: String,
        required: true
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

module.exports = mongoose.model('postJob', PostJobSchema);