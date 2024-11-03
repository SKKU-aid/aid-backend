// src/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User.js')
const createResponse = require('../responseTemplate.js');

// checkRegisterdUser, userLogin
router.post('/', async (req, res) => {
    
});

module.exports = router;