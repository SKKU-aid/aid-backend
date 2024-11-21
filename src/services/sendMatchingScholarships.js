const cron = require('node-cron');
const mongoose = require('mongoose');
const User = require("../models/User.js");
const Scholarships = require('../models/Scholarship.js');
const CompactScholarship = require('../models/CompactScholarship.js');
const createResponse = require('../utils/responseTemplate.js');
const createListResponse = require('../utils/responseListTemplate.js');
const compactScholarship = require('../utils/compactScholarship.js');
const buildMatchingScholarships = require('../utils/buildMatchingScholarships.js');
const sendEmailNotification=require('../daemon/sendEmail.js');


async function sendMatchingScholarships() {
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    console.log('sendMatchingScholarships running at:', today.toDateString());

    try {
        // get users and scholarships info
        const users = await User.find();
        
        const scholarships = await Scholarships.find();

        const recentlyUploadedScholarships = scholarships.filter(scholarship => {
            // Parse the updateDate string into a Date object
            const uploadedDate = scholarship.uploadedDate;

            // Check if updateDate falls within the past 3 days
            return uploadedDate >= threeDaysAgo && uploadedDate <= today;
        });

        for (const user of users) {
            console.log('User Email:', user.userID);

            //return Scholarships that saved and below 3 days left to Deadline
            const matchingScholarships = recentlyUploadedScholarships.filter(buildMatchingScholarships(user));

            console.log('matchingScholarships:', matchingScholarships);
            //Todo
            //Send Email to user, Use matchingScholarships for implementation
            sendEmailNotification({ email: user.userID, type: 'sendMatchingScholarships', content: matchingScholarships });
        }

    } catch (error) {
        console.error('Error occur: ', error);
        return;
    }
}

//execute function every 3 days at 22:00
cron.schedule('0 22 */3 * *',sendMatchingScholarships);

//execute this function every one minute (for testing)
// cron.schedule('* * * * *', sendMatchingScholarships);

module.exports = sendMatchingScholarships;