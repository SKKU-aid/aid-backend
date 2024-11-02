const express = require('express')
const app = express();
const port = 8082

// Middleware to parse JSON data
app.use(express.json());

//connet to mongoDB using mongoose
const mongoose = require('mongoose');
const mongoURI = 'mongodb://root:1398@mongo:27017/auth?authSource=admin';

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import model for get data from db
const User = require("./src/model/User.js")
const Scholarship = require('./src/model/Scholarship');

const createResponse = require('./src/responseTemplate.js'); // Import the response template helper
const createListResponse = require('./src/responseListTemplate.js'); // Import the response template helper


// registerUser
app.post('/register', (req, res) => {

});

// checkIDReplicated
app.get('/register/checkID', (req, res) => {

});

// getUserInfo
app.get('/users/:userID', (req, res) => {


});

// updateUserInfo
app.put('/users/:userID/update-info', (req, res) => {

});

// updateUserPassWord
app.put('/users/:userID/update-pw', (req, res) => {

});

// checkRegisterdUser, userLogin
app.post('/login', (req, res) => {

});

// getScholarshipAll
app.get('/scholarships', async (req, res) => {
    try {
        const scholarships = await Scholarship.find();
        console.log('Scholarships:', scholarships); // Log to check data
        res.status(200).json(createListResponse(true, "successfully get shocalrships data", scholarships));
    } catch (error) {
        console.error('Error retrieving scholarships:', error);
        res.status(500).json(createResponse(false, "fail to get scholarships", null));
    }
});

// getScholarship
app.get('/scholarships/:scholarshipID', async (req, res) => {
    const scholarshipID = req.params.scholarshipID;  // Correct spelling if needed

    try {
        const scholarship = await Scholarship.findOne({ scholarship_id: scholarshipID });

        if (!scholarship) {
            console.error(`scholarshipID: ${scholarshipID} doesn't exist`);
            // Add 'return' to prevent further execution
            return res.status(404).json(createResponse(false, "scholarshipID doesn't exist", null));
        }

        // Only executes if scholarship is found
        res.status(200).json(createResponse(true, "Successfully retrieved scholarship data", scholarship));
    } catch (error) {
        console.error('Error retrieving scholarship:', error);
        res.status(500).json(createResponse(false, "Failed to retrieve scholarship", null));
    }
});


// getRecommandedScholarshipInfo
app.get('/users/:userID/scholarships', async (req, res) => {
    const userID = req.params.userID; // Extract userID from the route parameter
    console.log('User ID:', userID); // For debugging
    try {
        const user = await User.findOne({ user_id: userID }, 'saved_scholarship'); // Query for user by user_id

        // Check if user is null (not found in the database)
        if (!user) {
            console.error(`User with user_id: ${userID} doesn't exist`);
            return res.status(404).json(createResponse(false, "userID doesn't exist in DB", null));
        }

        //make data as list and list's element is scholarship get from user.saved_scholarship

        // Step 2: Find scholarships where eligible_majors includes the user's major
        const matchingScholarships = await Scholarship.find({
            eligible_majors: { $in: [user.major] },
            minimum_gpa: { $lte: user.total_gpa },
            income_level_requirement: { $gte: user.income_level }
        });
        console.log(matchingScholarships)
        res.status(200).json(createResponse(true, "userID exists", matchingScholarships));
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json(createResponse(false, "Failed to retrieve user data", null));
    }
});

// getSavedScholarshipsInfo
app.get('/users/:userID/fav-scholarships', async (req, res) => {
    const userID = req.params.userID; // Extract userID from the route parameter
    console.log('User ID:', userID); // For debugging

    try {
        const user = await User.findOne({ user_id: userID }, 'saved_scholarship'); // Query for user by user_id

        // Check if user is null (not found in the database)
        if (!user) {
            console.error(`User with user_id: ${userID} doesn't exist`);
            return res.status(404).json(createResponse(false, "userID doesn't exist in DB", null));
        }

        //make data as list and list's element is scholarship get from user.saved_scholarship
        const savedScholarships = await Scholarship.find({ scholarship_id: { $in: user.saved_scholarship } });


        res.status(200).json(createResponse(true, "userID exists", savedScholarships));
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json(createResponse(false, "Failed to retrieve user data", null));
    }
});

// addSavedScholarship
app.post('/users/:userID/fav-scholarships', (req, res) => {

});

// deleteSavedScholarship
app.delete('/users/:userID/fav-scholarships/:scholarshipID', (req, res) => {

});

app.listen(port, () => {
    console.log('listening on 8082');
});
