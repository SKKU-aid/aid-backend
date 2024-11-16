// src/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User.js')
const createResponse = require('../utils/responseTemplate.js');

// checkRegisteredUser, userLogin
router.post('/', async (req, res) => {
    try {
        // Extract user info from the route parameter
        const {
            userID,
            userPassword
        } = req.body;
        console.log('User ID:', userID); // For debugging

        // Retrieve user with necessary fields
        const user = await User.findOne({ userID: userID });
        
        // Check if user is null (not found in the database)
        if (!user) {
            console.error(`User with user_id: ${userID} doesn't exist`);
            return res.status(404).json(createResponse(false, "Wrong userID", null));
        }
        
        if (user.userPassword != userPassword) {
            console.error(`wrong password`);
            return res.status(404).json(createResponse(false, "Wrong password", null));
        }

        res.status(200).json(createResponse(true, "Log in successfully", { userID: userID }));
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json(createResponse(false, "Failed to retrieve user", null));
    }
});

module.exports = router;