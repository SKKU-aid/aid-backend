const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user_id: String,
    sex: String,
    major: String,
    total_gpa: Number,
    last_gpa: Number,
    semester: Number,
    age: Number,
    region: String,
    income_level: Number,
    saved_scholarship: Array
});

module.exports = mongoose.model('User', UserSchema);