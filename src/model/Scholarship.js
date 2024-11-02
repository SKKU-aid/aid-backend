const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
    _id : {type: Number},
    scholarship_id: { type: Number, unique: true },
    name: { type: String },
    eligible_majors: { type: [String] },
    minimum_gpa: { type: Number },
    eligible_semesters: { type: [Number] },
    type: { type: String },
    age_limit: { type: Number },
    regional_restrictions: { type: [String] },
    income_level_requirement: { type: Number },
    application_period: { type: String },
    amount: { type: Number },
    recipients: { type: Number },
    required_documents: { type: [String] },
    application_method: { type: String },
    significant_notes: { type: String },
    link: { type: String },
    views: { type: Number, default: 0 },
    foundation: { type: String }
});

module.exports = mongoose.model('Scholarships', scholarshipSchema,'Scholarships');
