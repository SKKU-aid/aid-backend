const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
    _id: { type: Number, unique: true },
    scholarshipName: { type: String },
    eligibleMajors: { type: [String] },
    minimumGPARequirement: { type: Number },
    eligibleSemesters: { type: [Number] },
    scholarshipType: { type: String },
    ageLimit: { type: Number, default: null },
    regionalRestrictions: { type: [String] },
    incomeLevelRequirement: { type: Number },
    applicationPeriod: { type: String },
    scholarshipAmount: { type: Number },
    numberOfRecipients: { type: Number },
    requiredDocuments: { type: [String] },
    applicationMethod: { type: String },
    significant: { type: String, default: null },
    link: { type: String },
    views: { type: Number, default: 0 },
    foundation: { type: String }
});

module.exports = mongoose.model('Scholarships', scholarshipSchema, 'scholarships');
