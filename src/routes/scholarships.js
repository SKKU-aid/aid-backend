const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const User = require("../models/User.js")
const Scholarship = require('../models/Scholarship.js');
const CompactScholarship = require('../models/CompactScholarship.js');
const createResponse = require('../responseTemplate.js');
const createListResponse = require('../responseListTemplate.js');


//It return data right form
// Get all scholarships with isFav set based on user's saved scholarships
router.get('/', async (req, res) => {
    const userID = req.query.userID;

    try {
        const user = await User.findOne({  userID: userID }, 'savedScholarship');
        if (!user) {
            return res.status(404).json(createResponse(false, "User not found", null));
        }

        // Convert saved scholarship IDs to numbers if necessary
        const savedScholarshipIDs = (user.savedScholarship || []).map(id => Number(id));

        // Get scholarships from the database
        const scholarships = await Scholarship.find();

        // Convert scholarships to compact format with required fields
        const compactScholarships = scholarships.map(scholarship => {
            const scholarshipID = scholarship._id;
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

        // Directly return the compact scholarship data
        res.status(200).json(createResponse(true,"Succesfuly return data",compactScholarships));
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
        if (!user) {
            return res.status(404).json(createResponse(false, "User not found", null));
        }

        // Convert saved scholarship IDs to numbers if necessary
        const savedScholarshipIDs = (user.savedScholarship || []).map(id => Number(id));

        // Get the scholarship from the database
        const scholarship = await Scholarship.findOne({ _id: scholarshipID });

        if (!scholarship) {
            return res.status(404).json(createResponse(false, "Scholarship not found", null));
        }

        // Convert the scholarship to compact format with required fields
        const compactScholarship = {
            scholarshipID: scholarship._id,
            scholarshipName: scholarship.scholarshipName || "Unknown Scholarship",
            applicationPeriod: scholarship.applicationPeriod || "Unknown Period",
            foundation: scholarship.foundation || "Unknown Foundation",
            views: scholarship.views || 0,
            isFav: savedScholarshipIDs.includes(scholarship._id),
            tags: scholarship.tags || [
                scholarship.scholarshipType || "General",
                scholarship.regionalRestrictions?.[0] || "No Region",
                scholarship.eligibleMajors?.[0] || "No Major"
            ]
        };

        // Directly return the compact scholarship data
        res.status(200).json(createResponse(true,"Succes to get data",compactScholarship));
    } catch (error) {
        console.error('Error retrieving scholarship:', error);
        res.status(500).json(createResponse(false, "Failed to retrieve scholarship", null));
    }
});


module.exports = router;