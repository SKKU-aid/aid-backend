const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
    _id: { type: Number, required: true, unique: true },
    scholarshipName: { type: String, required: true },
    eligibleMajors: { type: [String], required: true, default: [] },
    minimumGPARequirement: { type: Number, required: true, default: null },
    eligibleSemesters: { type: [Number], required: true },
    scholarshipType: { type: String, required: true },
    ageLimit: { type: Number, required: true, default: null },
    regionalRestrictions: { type: [String], required: true },
    incomeLevelRequirement: { type: Number, required: true, default: null },
    applicationPeriod: { type: String, required: true },
    scholarshipAmount: { type: Number, required: true },
    numberOfRecipients: { type: Number, required: true },
    requiredDocuments: { type: [String], required: true },
    applicationMethod: { type: String, required: true },
    significant: { type: String, required: true, default: null },
    link: { type: String, required: true },
    views: { type: Number, required: true, default: 0 },
    foundation: { type: String, required: true }
});

module.exports = mongoose.model('Scholarships', scholarshipSchema, 'scholarships');
