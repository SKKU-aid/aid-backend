// src/routes/users.js
const express = require('express');
const router = express.Router();
const User = require("../models/User.js")
const Scholarship = require('../models/Scholarship.js');
const createResponse = require('../responseTemplate.js');
const createListResponse = require('../responseListTemplate.js');

// getRecommandedScholarshipInfo
router.get('/:userID/scholarships', async (req, res) => {
    const userID = req.params.userID; // Extract userID from the route parameter
    console.log('User ID:', userID); // For debugging

    try {
        // Retrieve user with necessary fields
        const user = await User.findOne({ user_id: userID }, 'saved_scholarship major total_gpa income_level');

        // Check if user is null (not found in the database)
        if (!user) {
            console.error(`User with user_id: ${userID} doesn't exist`);
            return res.status(404).json(createResponse(false, "userID doesn't exist in DB", null));
        }

        // Query for scholarships where eligible_majors includes the user's major,
        // user's GPA is above the minimum required, and income level meets the requirement
        const matchingScholarships = await Scholarship.find({
            eligible_majors: { $in: [user.major] },
            minimum_gpa: { $lte: user.total_gpa },
            income_level_requirement: { $gte: user.income_level }
        });

        console.log('Matching Scholarships:', matchingScholarships); // Log matching scholarships for debugging
        res.status(200).json(createResponse(true, "Matching scholarships retrieved successfully", matchingScholarships));
    } catch (error) {
        console.error('Error retrieving scholarships for user:', error);
        res.status(500).json(createResponse(false, "Failed to retrieve scholarships for user", null));
    }
});


module.exports = router;