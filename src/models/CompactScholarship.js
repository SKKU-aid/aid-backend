const mongoose = require('mongoose');

const compactScholarshipSchema = new mongoose.Schema({
    scholarshipID: { type: Number, unique: true },
    scholarshipName: { type: String },
    applicationPeriod: { type: String },
    foundation: { type: String },
    views: { type: Number, default: 0 },
    isFav: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
   });

module.exports = mongoose.model('CompactScholarships', compactScholarshipSchema, 'scholarships');
