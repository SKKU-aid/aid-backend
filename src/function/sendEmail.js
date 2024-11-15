const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.user,
        pass: process.env.pass,
    },
});

const sendEmailNotification = (data) => {
    const mailOptions = {
        from: process.env.user,
        to: data.email,
        subject: data.subject,
        text: data.text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email: ', error);
        } else {
            console.log('Email sent: ' + info.response);

        }
    });
};

module.exports = sendEmailNotification