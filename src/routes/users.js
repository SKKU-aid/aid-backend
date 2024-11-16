// src/routes/users.js
const express = require('express');
const router = express.Router();
const User = require("../models/User.js")
const Scholarship = require('../models/Scholarship.js');
const createResponse = require('../responseTemplate.js');
const createListResponse = require('../responseListTemplate.js');
const { findByIdAndUpdate } = require('../models/CompactScholarship.js');
const sendEmailNotification = require('../daemon/sendEmail.js');
const generateVerificationCode = require('../daemon/verificationCode.js')
const EventEmitter = require('events');
const { verify } = require('crypto');

require('dotenv').config()

// getUserInfo
router.get('/:userID', async (req, res) => {
    const userID = req.params.userID; // Extract userID from the route parameter
    console.log('User ID:', userID); // For debugging

    try {
        // Retrieve user with necessary fields
        const user = await User.findOne({ userID: userID });

        // Check if user is null (not found in the database)
        if (!user) {
            console.error(`User with user_id: ${userID} doesn't exist`);
            return res.status(404).json(createResponse(false, "userID doesn't exist in DB", null));
        }
        
        res.status(200).json(createResponse(true, "user information has been successfully retrieved", user));
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json(createResponse(false, "Failed to retrieve user", null));
    }
});

// getUserInfo
router.get('/:userID', async (req, res) => {
    const userID = req.params.userID; // Extract userID from the route parameter
    console.log('User ID:', userID); // For debugging

    try {
        // Retrieve user with necessary fields
        const user = await User.findOne({ userID: userID });

        // Check if user is null (not found in the database)
        if (!user) {
            console.error(`User with user_id: ${userID} doesn't exist`);
            return res.status(404).json(createResponse(false, "userID doesn't exist in DB", null));
        }
        
        res.status(200).json(createResponse(true, "user information has been successfully retrieved", user));
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json(createResponse(false, "Failed to retrieve user", null));
    }
});

// updateUserInfo
router.put('/:userID/update-info', async (req, res) => {
    const userID = req.params.userID; // Extract userID from the route parameter
    console.log('User ID:', userID); // For debugging

    try {
        // Retrieve user with necessary fields
        const user = await User.findOne({ userID: userID });

        // Check if user is null (not found in the database)
        if (!user) {
            console.error(`User with user_id: ${userID} doesn't exist`);
            return res.status(404).json(createResponse(false, "userID doesn't exist in DB", null));
        }
        
        await User.findOneAndUpdate({ userID: userID }, req.body);

        res.status(200).json(createResponse(true, "user information has been successfully updated", req.body));
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json(createResponse(false, "Failed to retrieve user", null));
    }
});

// generateVerificationCode
router.post('/:userID/verify', async (req, res) => {
    const userID = req.params.userID; // Extract userID from the route parameter
    console.log('User ID:', userID); // For debugging

    try {
        // Retrieve user with necessary fields
        const user = await User.findOne({ userID: userID });

        // Check if user is null (not found in the database)
        if (!user) {
            console.error(`User with user_id: ${userID} doesn't exist`);
            return res.status(404).json(createResponse(false, "userID doesn't exist in DB", null));
        }

        const verifyCode = generateVerificationCode();
        const email = user.userEmail;
        const subject = "SKKU Scholarship Verification Code";
        const text = "인증 번호를 입력하십시오.\n인증 번호:\n" + verifyCode;

        await User.findOneAndUpdate({ userID: userID }, {$set: {verifyCode : verifyCode, verifyCodeCreatedAt: new Date()}});

        sendEmailNotification({email, subject, text});

        res.status(200).json(createResponse(true, "verification code has been successfully generated", req.body));
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json(createResponse(false, "Failed to retrieve user", null));
    }
});

// checkVerificationCode
router.post('/:userID/check-verify', async (req, res) => {
    // const userID = req.params.userID; // Extract userID from the route parameter
    // console.log('User ID:', userID); // For debugging

    try {
        const {
            userID,
            verifyCode
        } = req.body;
        // Retrieve user with necessary fields
        const user = await User.findOne({ userID: userID });

        // Check if user is null (not found in the database)
        if (!user) {
            console.error(`User with user_id: ${userID} doesn't exist`);
            return res.status(404).json(createResponse(false, "userID doesn't exist in DB", null));
        }
        
        if (!user.verifyCode || !user.verifyCodeCreatedAt || user.verifyCode != verifyCode) {
            return res.status(404).json(createResponse(false, "verificataion code is wrong", null));
        }

        const currentTime = new Date();
        const elapsedTime = currentTime - user.verifyCodeCreatedAt;
        console.log('verify time:', elapsedTime);

        if (elapsedTime > 5 * 60 * 1000) {
            return res.status(404).json(createResponse(false, "verificataion code is expired", null));
        }

        res.status(200).json(createResponse(true, "verification code is correct", req.body));
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json(createResponse(false, "Failed to retrieve user", null));
    }
});

// updateUserPassWord
router.put('/:userID/update-pw', async (req, res) => {
    try {
        // Extract user info from the route parameter
        const {
            userID,
            currentPassword,
            updatePassword
        } = req.body;
        console.log('User ID:', userID); // For debugging

        // Retrieve user with necessary fields
        const user = await User.findOne({ userID: userID });

        // Check if user is null (not found in the database)
        if (!user) {
            console.error(`User with user_id: ${userID} doesn't exist`);
            return res.status(404).json(createResponse(false, "userID doesn't exist in DB", null));
        }
        
        if (user.userPassword != currentPassword) {
            console.error(`wrong password`);
            return res.status(404).json(createResponse(false, "Wrong password", null));
        }


        await User.findOneAndUpdate({ userID: userID }, {userPassword: updatePassword});

        res.status(200).json(createResponse(true, "user password has been successfully updated", null));
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json(createResponse(false, "Failed to retrieve user", null));
    }
});


//It return data right form
// getRecommandedScholarshipInfo
router.get('/:userID/scholarships', async (req, res) => {
    const userID = req.params.userID; // Extract userID from the route parameter
    const type = req.query.type;
    if (type != "custom") {
        return res.status(500).json(createResponse(false, "type is not custom", null));
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
});

//addSavedScholarship
router.post('/:userID/fav-scholarships', async (req, res) => {
    try {
        const {
            userID,
            scholarshipID
        } = req.body;
        // Retrieve the user and their saved scholarships
        const user = await User.findOne({ userID }, 'savedScholarship');
        if (!user) {
            return res.status(404).json(createResponse(false, "User not found", null));
        }

        // Check if the user has any saved scholarships
        const savedScholarshipIDs = user.savedScholarship || [];

        if (savedScholarshipIDs.includes(scholarshipID)) {
            return res.status(404).json(createResponse(false, "Favorite scholarship already exists", null));
        }
        savedScholarshipIDs.push(scholarshipID);
        
        console.log('saved scholarship ID:', savedScholarshipIDs); // For debugging
        await User.findOneAndUpdate({ userID: userID }, {savedScholarship: savedScholarshipIDs});

        res.status(200).json(createResponse(true, "Favorite scholarships has been successfully deleted", null));
    } catch (error) {
        console.error('Error add favorite scholarships:', error);
        res.status(500).json(createResponse(false, "Failed to add favorite scholarships", null));
    }
});

//deleteSavedScholarship
router.delete('/:userID/fav-scholarships', async (req, res) => {
    try {
        const {
            userID,
            scholarshipID
        } = req.body;
        // Retrieve the user and their saved scholarships
        const user = await User.findOne({ userID }, 'savedScholarship');
        if (!user) {
            return res.status(404).json(createResponse(false, "User not found", null));
        }

        // Check if the user has any saved scholarships
        const savedScholarshipIDs = user.savedScholarship || [];

        const index = savedScholarshipIDs.indexOf(scholarshipID);
        if (index == -1) {
            return res.status(404).json(createResponse(false, "Favorite scholarship does not exit", null));
        }
        savedScholarshipIDs.splice(index, 1);

        console.log('saved scholarship ID:', savedScholarshipIDs); // For debugging
        await User.findOneAndUpdate({ userID: userID }, {savedScholarship: savedScholarshipIDs});

        res.status(200).json(createResponse(true, "Favorite scholarships has been successfully added", null));
    } catch (error) {
        console.error('Error add favorite scholarships:', error);
        res.status(500).json(createResponse(false, "Failed to add favorite scholarships", null));
    }
});

module.exports = router;