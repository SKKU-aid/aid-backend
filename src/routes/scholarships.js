const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const User = require("../models/User.js")
const Scholarship = require('../models/Scholarship.js');
const CompactScholarship = require('../models/CompactScholarship.js');
const createResponse = require('../responseTemplate.js');
const createListResponse = require('../responseListTemplate.js');
const compactScholarship = require('../compactScholarship.js');


//It return data right form
// Get all scholarships with isFav set based on user's saved scholarships
router.get('/', async (req, res) => {
    const userID = req.query.userID;

    try {
        //find user by userID
        const user = await User.findOne({ userID: userID }, 'savedScholarship');
        console.log(`userID:${userID}`);
        if (!user) {
            console.error(`Can\'t find user who userID: ${userID}`);
            return res.status(404).json(createResponse(false, `userID: ${userID} doesn't exist`, null));
        }

        // Convert saved scholarship IDs to numbers if necessary
        const savedScholarshipIDs = (user.savedScholarship || []).map(id => Number(id));
        console.log(`savedScholarshipIDs : ${savedScholarshipIDs}`);

        // Get scholarships from the database
        const scholarships = await Scholarship.find();
        if (!scholarship) {
            return res.status(404).json(createResponse(false, "fail to get scholarships from DB", null));
        }

        // Convert scholarships to compact format with required fields
        const compactScholarships = scholarships.map(scholarship => compactScholarship(scholarship, savedScholarshipIDs));

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
        const user = await User.findOne({ userID: userID }, 'savedScholarship');
        console.log(`userID:${userID}`);
        if (!user) {
            console.error(`Can\'t find user who userID: ${userID}`);
            return res.status(404).json(createResponse(false, `userID: ${userID} doesn't exist`, null));
        }

        // Convert saved scholarship IDs to numbers if necessary
        const savedScholarshipIDs = (user.savedScholarship || []).map(id => Number(id));

        // Get the scholarship from the database
        const scholarship = await Scholarship.findOne({ _id: scholarshipID });
        console.log(`scholarshipID: ${scholarship._id} doesn't exist`);
        if (!scholarship) {
            return res.status(404).json(createResponse(false, `scholarshipID: ${scholarship._id} doesn't exist`, null));
        }

        // Convert scholarships to compact format with required fields
        const compactScholarship = compactScholarship(scholarship, savedScholarshipIDs);

        // Return data
        res.status(200).json(createResponse(true, "Succesfuly return data", compactScholarship));
    } catch (error) {
        console.error('Error retrieving scholarship:', error);
        res.status(500).json(createResponse(false, "Failed to retrieve scholarship", null));
    }
});


module.exports = router;