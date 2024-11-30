const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const User = require("../models/User.js")
const Scholarships = require('../models/Scholarship.js');
const CompactScholarship = require('../models/CompactScholarship.js');
const createResponse = require('../utils/responseTemplate.js');
const createListResponse = require('../utils/responseListTemplate.js');
const compactScholarship = require('../utils/compactScholarship.js');


//It return data right form
// Get all scholarships with isFav set based on user's saved scholarships
router.get('/', async (req, res) => {
    const userID = req.query.userID;

    try {
        //find user by userID
        const user = await User.findOne({ userID: userID }, 'savedScholarship');
        console.log(`userID:${userID}`);
        let savedScholarshipIDs = [];
        if (!user) {
            console.error(`Can\'t find user who userID: ${userID}`);
        } else {
            savedScholarshipIDs = (user.savedScholarship || []).map(id => Number(id));
        }

        // Convert saved scholarship IDs to numbers if necessary

        console.log(`savedScholarshipIDs : ${savedScholarshipIDs}`);

        // Get scholarships from the database
        const scholarships = await Scholarships.find();
        // if (!scholarships) {
        //     return res.status(404).json(createResponse(false, "fail to get scholarships from DB", null));
        // }

        // Convert scholarships to compact format with required fields
        const compactScholarships = scholarships.map(scholarships => compactScholarship(scholarships, savedScholarshipIDs));

        // Return data
        res.status(200).json(createResponse(true, "Succesfuly return data", compactScholarships));
    } catch (error) {
        console.error('Error retrieving scholarships:', error);
        res.status(500).json(createResponse(false, "Failed to retrieve scholarships", null));
    }
});

//It return data right form
// Get a specific scholarship by ID
router.get('/:scholarshipID', async (req, res) => {
    const scholarshipID = req.params.scholarshipID;
    const userID = req.query.userID;

    try {
        //find user by userID
        const user = await User.findOne({ userID: userID }, 'savedScholarship');
        console.log(`userID:${userID}`);
        let savedScholarshipIDs = [];
        if (!user) {
            console.error(`Can\'t find user who userID: ${userID}`);
        } else {
            savedScholarshipIDs = (user.savedScholarship || []).map(id => Number(id));
        }

        // Get the scholarship from the database and increase view
        const scholarship = await Scholarships.findOneAndUpdate(
            { _id: scholarshipID },
            { $inc: { views: 1 } },
            { new: true }
        );
        if (!scholarship) {
            console.log(`scholarshipID: ${scholarshipID} doesn't exist`);
            return res.status(404).json(createResponse(false, `scholarshipID: ${scholarshipID} doesn't exist`, null));
        }

        // Return data
        res.status(200).json(createResponse(true, "Succesfuly return data", scholarship));
    } catch (error) {
        console.error('Error retrieving scholarship:', error);
        res.status(500).json(createResponse(false, "Failed to retrieve scholarship", null));
    }
});


module.exports = router;