const nodemailer = require('nodemailer')
require('dotenv').config()

const getScholarshipsContent = (data) => {
    return (
        data.map(scholarship => `
        For more information, please refer to the site below.
        link: ${data.link || "알 수 없음"}
        장학금: ${scholarship.scholarshipName || "알 수 없음"}
        장학재단: ${scholarship.foundation || "알 수 없음"}
        장학종류: ${scholarship.scholarshipType || "알 수 없음"}
        선발인원: ${scholarship.numberOfRecipients || "알 수 없음"}
        장학혜택: ${scholarship.scholarshipAmount || "알 수 없음"}
        신청 기간: ${scholarship.applicationPeriod || "알 수 없음"}
        선발 대상: ${(scholarship.eligibleMajors || []).length > 0 
            ? scholarship.eligibleMajors.map(major => major).join(", ")
            : "전공 무관"
        }
        `.split('\n')
        .map(line => line.trim())
        .join('\n'))
        .join('\n------------------------\n')
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
        case 'sendMatchingScholarships':
            const subjectMatching = 'Updated Info on Recommended Scholarships';
            const commonMessageMatching = 'There is updated information regarding the recommended scholarship.\n\n';
            return {
                subject: subjectMatching,
                text: commonMessageMatching + getScholarshipsContent(data)
            };
        case 'sendSavedScholarshipsBeforeDeadline':
            const subjectDeadline = 'The deadline for your saved scholarship is approaching';
            const commonMessageDeadline = 'There are 3 days left until the deadline for the saved scholarship.\n\n';
            return {
                subject: subjectDeadline,
                text: commonMessageDeadline + getScholarshipsContent(data)
            };
        case 'sendUpdatedSavedScholarships':
            const subjectUpdated = 'Updated Info for your saved Scholarships';
            const commonMessageUpdated = 'There is updated information regarding the saved scholarship.\n\n';
            return {
                subject: subjectUpdated,
                text: commonMessageUpdated + getScholarshipsContent(data)
            };
        default:
            throw new Error(`Unknown email type: ${type}`);
    }
};

// data {email, type, content}
const sendEmailNotification = (data) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.user,
            pass: process.env.pass,
        },
    });
    
    const mail_data = getEmailContent(data.type, data.content);
    const mailOptions = {
        from: process.env.user,
        to: data.email,
        subject: mail_data.subject,
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

module.exports = sendEmailNotification;
module.exports.getScholarshipsContent = getScholarshipsContent;