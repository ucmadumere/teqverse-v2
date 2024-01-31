const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PremiumJobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    jobOverview: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        enum: ['Hybrid', 'Remote', 'Onsite'],
        // required: true
    },
    workType: {
        type: String,
        enum: ['Contract', 'Full Time', 'Part Time', 'Internship'],
        // required: true
    },
    jobLocation: {
        type: String,
        // required: true
    },
    experience: { 
        type: Number, 
        required: false
    },
    requirements: { 
        type: [String], 
        default: [] 
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

module.exports = mongoose.model('premiumJob', PremiumJobSchema);