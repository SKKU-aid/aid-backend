const mongoose = require("mongoose");

const ScholarshipSchema = mongoose.Schema(
    {

    }
);

const Scholarship = mongoose.model("Scholarship", ScholarshipSchema);

module.exports = Scholarship;