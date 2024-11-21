const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.user,
        pass: process.env.pass,
    },
});

const getScholarshipsContent = (data) => {
    return (
        data.map(scholarship => `
        For more information, please refer to the site below.
        ${data.link}

        장학금: ${scholarship.scholarshipName}
        장학재단: ${scholarship.foundation}
        장학종류: ${scholarship.scholarshipType}
        선발인원: ${scholarship.numberOfRecipients}
        장학혜택: ${scholarship.scholarshipAmount}
        신청 기간: ${scholarship.applicationPeriod}
        선발 대상: ${(scholarship.eligibleMajors || []).map(major => major).join(", ")}
        `.split('\n')
        .map(line => line.trim())
        .join('\n'))
        .join('\n------------\n')
    )
}


// const subject = "SKKU Scholarship Verification Code";
// const text = "인증 번호를 입력하십시오.\n인증 번호:\n" + verifyCode;
const getEmailContent = (type, data) => {
    switch(type) {
        case 'verification':
            return {
                subject: 'SKKU Scholarship Verification Code',
                text: `Please enter your verification code.
                Verification Code:
                ${data.verifyCode}
                `.split('\n')
                .map(line => line.trim())
                .join('\n')
            };
        case 'matchingScholarships':
            subject = 'Updated Info on Recommended Scholarships';
            commonMessage = 'There is updated information regarding the recommended scholarship.';

        case 'filteredScholarships':
            subject = 'The deadline for your saved scholarship is approaching.';
            commonMessage = 'There are 3 days left until the deadline for the saved scholarship.';

        default:
            return {
                subject: subject,
                text: commonMessage + getScholarshipsContent(data)
            };
    }
};

// data {email, type, content}
const sendEmailNotification = (data) => {
    const mail_data = getEmailContent(data.type, data.content);
    console.log('Error ' + data.email);
    const mailOptions = {
        from: process.env.user,
        to: data.email,
        subject: mail_data.type,
        text: mail_data.text
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