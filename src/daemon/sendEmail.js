const e = require('express');
const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.user,
        pass: process.env.pass,
    },
});

// const getEmailContent = (type) => {
//   switch(type) {
//     case '':
//       return {
//         subject: 'Welcome to our service!',
//         text: 'Hello and welcome to our service. We are excited to have you!'
//       };
//     case 'order':
//       return {
//         subject: 'Your order has been confirmed',
//         text: 'Thank you for your order. Your order will be processed shortly.',
//         html: '<p>Thank you for your order. Your order will be processed shortly.</p>'
//       };
//     case 'reset-password':
//       return {
//         subject: 'Password Reset Request',
//         text: 'Click the link below to reset your password.',
//         html: '<p>Click the link below to reset your password:</p><a href="#">Reset Password</a>'
//       };
//     default:
//       return {
//         subject: 'Default Subject',
//         text: 'This is the default email content.',
//         html: '<p>This is the default email content.</p>'
//       };
//   }
// };

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