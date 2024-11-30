// tests/daemon/sendEmail.test.js

jest.mock('nodemailer');

const nodemailer = require('nodemailer');
const sendEmailNotification = require('../../src/daemon/sendEmail');

describe('sendEmailNotification', () => {
  let sendMailMock;

  beforeAll(() => {
    process.env.user = 'testuser@example.com';
    process.env.pass = 'testpassword';
  });

  beforeEach(() => {
    sendMailMock = jest.fn((mailOptions, callback) => {
      callback(null, { response: 'Email sent' });
    });

    nodemailer.createTransport.mockReturnValue({
      sendMail: sendMailMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send email with correct options for verification type', () => {
    const data = {
      email: 'user@example.com',
      type: 'verification',
      content: { verifyCode: 'ABC123' },
    };

    sendEmailNotification(data);

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: process.env.user,
        to: data.email,
        subject: 'SKKU Scholarship Verification Code',
        text: expect.stringContaining(data.content.verifyCode),
      }),
      expect.any(Function)
    );
  });

  it('should handle sendMail errors', () => {
    sendMailMock.mockImplementation((mailOptions, callback) => {
      callback(new Error('Failed to send email'), null);
    });

    console.log = jest.fn();

    const data = {
      email: 'user@example.com',
      type: 'verification',
      content: { verifyCode: 'ABC123' },
    };

    sendEmailNotification(data);

    expect(console.log).toHaveBeenCalledWith('Error sending email: ', expect.any(Error));
  });
});
