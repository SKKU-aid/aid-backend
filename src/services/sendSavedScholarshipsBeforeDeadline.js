const cron = require('node-cron');
const mongoose = require('mongoose');
const User = require("../models/User.js");
const Scholarships = require('../models/Scholarship.js');
const CompactScholarship = require('../models/CompactScholarship.js');
const createResponse = require('../utils/responseTemplate.js');
const createListResponse = require('../utils/responseListTemplate.js');
const compactScholarship = require('../utils/compactScholarship.js');
const sendEmailNotification = require('../../src/daemon/sendEmail.js');

async function sendSavedScholarshipsBeforDeadline() {
    const today = new Date();
    console.log('sendSavedScholarshipsBeforDeadline running at:', today.toDateString());

    try {
        // get users and scholarships info
        const users = await User.find();
        const scholarships = await Scholarships.find();

        for (const user of users) {
            console.log('User Email:', user.userEmail);

            //return Scholarships that saved and below 3 days left to Deadline
            const filteredScholarships = scholarships.filter(scholarship => {
                const isSaved = user.savedScholarship.includes(Number(scholarship._id));
                if (!scholarship.applicationPeriod) {
                    return false;
                }
                const [start, end] = scholarship.applicationPeriod.split('~').map(date => new Date(date.trim()));
                const timeDifference = end - today; // Difference in milliseconds
                const daysDifference = timeDifference / (1000 * 60 * 60 * 24); // Convert milliseconds to days

                // Return true if scholarship is saved and due date is within 3 days
                return isSaved && daysDifference < 3 && daysDifference >= 0;
            });

            //Todo
            //Send Email to user, Use filteredScholarships for implementation
            if (filteredScholarships.length !== 0) {
                sendEmailNotification({ email: user.userEmail, type: 'sendSavedScholarshipsBeforeDeadline', content: filteredScholarships });
            }
        }

    } catch (error) {
        console.error('Error occur: ', error);
        return;
    }
}

//execute function everyday at 22:00
cron.schedule('0 22 * * *', sendSavedScholarshipsBeforDeadline);

//execute this function every one minute (for testing)
// cron.schedule('* * * * *', sendSavedScholarshipsBeforDeadline);

module.exports = sendSavedScholarshipsBeforDeadline;