const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
    {
        userID: { type: String, required: true },
        userPassword: { type: String, required: true },
        userEmail: { type: String, required: true },
        sex: { type: Boolean, required: true },
        birthday: { type: Date, required: true },
        currentSemester: { type: Number, required: true },
        currentStatus: { type: String, required: true },
        totalGPA: { type: Number, required: true },
        lastGPA: { type: Number, required: true },
        incomeLevel: { type: Number, required: true },
        major: { type: String, required: true },
        region: { type: String, required: true },
        savedScholarship: {
            type: [{ type: Number }], required: true, default: []
        }
    }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;