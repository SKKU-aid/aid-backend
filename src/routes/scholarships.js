const express = require('express');
const router = express.Router();
const User = require("../models/User.js")
const Scholarship = require('../models/Scholarship.js');
const CompactScholarship = require('../models/CompactScholarship.js');
const createResponse = require('../responseTemplate.js');
const createListResponse = require('../responseListTemplate.js');

// Get all scholarships with isFav set based on user's saved scholarships
router.get('/', async (req, res) => {
    const userID = req.query.userID;

    try {
        const user = await User.findOne({ user_id: userID }, 'saved_scholarship');
        if (!user) {
            return res.status(404).json(createResponse(false, "User not found", null));
        }
        console.log("user: ", user);

        // Convert saved scholarship IDs to numbers if necessary
        const savedScholarshipIDs = (user.saved_scholarship || []).map(id => Number(id));
        console.log("savedScholarshipsIDs: ", savedScholarshipIDs);
        // Get scholarships from the database
        const scholarships = await Scholarship.find();

        // Convert scholarships to compact format with required fields
        const compactScholarships = scholarships.map(scholarship => {
            const scholarshipID = scholarship.scholarshipID;
            console.log("scholarshipID: ", scholarshipID, "\n is Fav:", savedScholarshipIDs.includes(scholarshipID));
            // Check if scholarshipID is valid and set isFav accordingly
            return {
                scholarshipID,
                scholarshipName: scholarship.scholarshipName || "Unknown Scholarship",
                applicationPeriod: scholarship.applicationPeriod || "Unknown Period",
                foundation: scholarship.foundation || "Unknown Foundation",
                views: scholarship.views || 0,
                isFav: savedScholarshipIDs.includes(scholarshipID),
                tags: scholarship.tags || [
                    scholarship.scholarshipType || "General",
                    scholarship.regionalRestrictions?.[0] || "No Region",
                    scholarship.eligibleMajors?.[0] || "No Major"
                ]
            };
        });

        res.status(200).json(createListResponse(true, "Scholarships retrieved successfully", compactScholarships));
    } catch (error) {
        console.error('Error retrieving scholarships:', error);
        res.status(500).json(createResponse(false, "Failed to retrieve scholarships", null));
    }
});




// Get a specific scholarship by ID
router.get('/:scholarshipID', async (req, res) => {
    const scholarshipID = req.params.scholarshipID;
    try {
        const scholarship = await Scholarship.findOne({ scholarshipID: scholarshipID });
        if (!scholarship) {
            return res.status(404).json(createResponse(false, "Scholarship not found", null));
        }
        res.status(200).json(createResponse(true, "Scholarship retrieved successfully", scholarship));
    } catch (error) {
        console.error('Error retrieving scholarship:', error);
        res.status(500).json(createResponse(false, "Failed to retrieve scholarship", null));
    }
});

module.exports = router;
