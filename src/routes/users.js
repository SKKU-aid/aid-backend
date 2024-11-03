// src/routes/users.js
const express = require('express');
const router = express.Router();
const User = require("../models/User.js")
const Scholarship = require('../models/Scholarship.js');
const createResponse = require('../responseTemplate.js');
const createListResponse = require('../responseListTemplate.js');

//It return data right form
// getRecommandedScholarshipInfo
router.get('/:userID/scholarships', async (req, res) => {
    const userID = req.params.userID; // Extract userID from the route parameter
    const type = req.query.type;
    if (type != "custom") {
        res.status(500).json(createResponse(false, "type is not custom", null));
    }
    console.log('User ID:', userID); // For debugging

    try {
        // Retrieve user with necessary fields
        const user = await User.findOne({ userID: userID });

        // Check if user is null (not found in the database)
        if (!user) {
            console.error(`User with user_id: ${userID} doesn't exist`);
            return res.status(404).json(createResponse(false, "userID doesn't exist in DB", null));
        }

        // Query for scholarships where eligible_majors includes the user's major,
        // user's GPA is above the minimum required, and income level meets the requirement
        const matchingScholarships = await Scholarship.find({
            eligibleMajors: { $in: [user.major] }, // Wrap user.major in an array
            minimumGPARequirement: { $lte: user.totalGPA },
            incomeLevelRequirement: { $gte: user.incomeLevel }
        });
        console.log('Matching Scholarships:', matchingScholarships); // Log matching scholarships for debugging
        res.status(200).json(createResponse(true, "Matching scholarships retrieved successfully", matchingScholarships));
    } catch (error) {
        console.error('Error retrieving scholarships for user:', error);
        res.status(500).json(createResponse(false, "Failed to retrieve scholarships for user", null));
    }
});

//It return data right form
//getSavedScholarshipsInfo
router.get('/:userID/fav-scholarships', async (req, res) => {
    const userID = req.params.userID;
    try {
        // Retrieve the user and their saved scholarships
        const user = await User.findOne({ userID }, 'savedScholarship');
        if (!user) {
            return res.status(404).json(createResponse(false, "User not found", null));
        }

        // Check if the user has any saved scholarships
        const savedScholarshipIDs = user.savedScholarship || [];

        // If there are no saved scholarships, return an empty array
        if (savedScholarshipIDs.length === 0) {
            return res.status(200).json(createResponse(true, "관심 장학을 불러오는데 성공 했습니다", [{}]));
        }

        // Fetch the saved scholarships from the database
        const scholarships = await Scholarship.find({ _id: { $in: savedScholarshipIDs } });

        // Map the scholarships to the desired compact format
        // Return the data
        res.status(200).json(createResponse(true, "관심 장학을 불러오는데 성공 했습니다", scholarships));
    } catch (error) {
        console.error('Error retrieving favorite scholarships:', error);
        res.status(500).json(createResponse(false, "관심장학을 불러오는데 실패 했습니다", null));
    }
})
module.exports = router;