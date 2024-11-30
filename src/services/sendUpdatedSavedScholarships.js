const cron = require('node-cron');
const mongoose = require('mongoose');
const User = require("../models/User.js");
const Scholarships = require('../models/Scholarship.js');
const CompactScholarship = require('../models/CompactScholarship.js');
const createResponse = require('../utils/responseTemplate.js');
const createListResponse = require('../utils/responseListTemplate.js');
const compactScholarship = require('../utils/compactScholarship.js');
const sendEmailNotification = require('../daemon/sendEmail.js');


async function sendUpdatedSavedScholarships() {
    const today = new Date();
    console.log('sendUpdatedSavedScholarships running at:', today.toDateString());

    try {
        // get users and scholarships info
        const users = await User.find();

        const scholarships = await Scholarships.find();

        let updatedScholarships = new Set();
        for (const user of users) {
            console.log('User Email:', user.userEmail);

            //return Scholarships that saved and below 3 days left to Deadline
            const filteredScholarships = scholarships.filter(scholarship => {
                const isSaved = user.savedScholarship.includes(scholarship._id);
                const isUpdated = 
                    scholarship.lastUploadedDate !== null && 
                    scholarship.lastUploadedDate.getTime() !== scholarship.uploadedDate.getTime();
                // Return true if scholarship is saved and due date is within 3 days
                return isSaved && isUpdated
            });

            //add _id of filteredScholarships into updatedScholarships
            filteredScholarships.forEach(element => {
                updatedScholarships.add(element._id);
            });

            //Send Email to user, Use filteredScholarships for implementation
            if (filteredScholarships.length !== 0) {
                sendEmailNotification({ email: user.userEmail, type: 'sendUpdatedSavedScholarships', content: filteredScholarships });
            }
        }

        //if updatedScholarships exist update DB
        if (updatedScholarships.size > 0) {
            const updateResult = await Scholarships.updateMany(
                { _id: { $in: Array.from(updatedScholarships) } },
                [
                    { $set: { lastUploadedDate: "$uploadedDate" } }
                ]
            )
            console.log(`${updateResult.modifiedCount} scholarships updated successfully.`);
        }
        else {
            console.log("No scholarships required updating.");
        }

    } catch (error) {
        console.error('Error occur: ', error);
        return;
    }
}

//execute function everyday at 22:00
cron.schedule('0 22 * * *', sendUpdatedSavedScholarships);

//execute this function every one minute (for testing)
// cron.schedule('* * * * *', sendUpdatedSavedScholarships);

module.exports = sendUpdatedSavedScholarships;