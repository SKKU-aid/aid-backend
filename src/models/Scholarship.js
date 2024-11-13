const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
    _id: { type: Number, required: true, unique: true },
    scholarshipName: { type: String, required: true },
    eligibleMajors: { type: [String], default: [] },
    minimumGPARequirement: { type: Number, default: null },
    compTotalGPA: { type: Boolean, default: null },
    eligibleSemesters: { type: [Number], default: [] },
    scholarshipType: { type: String, required: true },
    ageLimit: { type: Number, default: null },
    regionalRestrictions: { type: [String], default: [] },
    incomeLevelRequirement: { type: Number, default: null },
    applicationPeriod: { type: String, required: true },
    scholarshipAmount: { type: String, default: null },
    numberOfRecipients: { type: Number, required: true },
    requiredDocuments: { type: [String], default: [] },
    applicationMethod: { type: String, default: null },
    significant: { type: String, required: true, default: null },
    link: { type: String, required: true },
    views: { type: Number, required: true },
    foundation: { type: String, required: true }
});

module.exports = mongoose.model('Scholarships', scholarshipSchema, 'scholarships');
