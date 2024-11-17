// src/routes/register.js
const express = require('express');
const router = express.Router();
const User = require('../models/User.js')
const createResponse = require('../utils/responseTemplate.js');
const createListResponse = require('../utils/responseListTemplate.js');

// registerUser
router.post('/', async (req, res) => {
    try {
        const {
            userID
        } = req.body;
        const user_exist = await User.findOne({ userID: userID });

        if (user_exist !== null) {
            return res.status(404).json(createResponse(false, "This userID already exists", null));
        }

        const user = await User.create(req.body);
        if (!user) {
            return res.status(404).json(createResponse(false, "User not found", null));
        }
        return res.status(200).json(createResponse(true, "User has been successfully registered", null));
    } catch (error) {
        console.error('Error register user:', error);
        return res.status(500).json(createResponse(false, "Failed to register", null));
    }
});

router.get('/checkID', async (req, res) => {
    try {
        // Extract userID from the route parameter
        const {
            userID
        } = req.body;
        console.log('User ID:', userID); // For debugging

        if (!userID) {
            return res.status(404).json(createResponse(false, "userID is empty", null));
        }
        
        const user = await User.findOne({ userID: userID });

        if (user !== null) {
            return res.status(404).json(createResponse(false, "This userID already exists", null));
        }
        res.status(200).json(createResponse(true, "This userID is available", user));
    } catch (error) {
        console.error('Error retrieve user:', error);
        res.status(500).json(createResponse(false, "Failed to retrieve userID", null));
    }
});

module.exports = router;