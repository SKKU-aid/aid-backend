const mongoose = require('mongoose');
const User = require('../../src/models/User');
const Scholarships = require('../../src/models/Scholarship');
const sendEmailNotification = require('../../src/daemon/sendEmail');
const buildMatchingScholarships = require('../../src/utils/buildMatchingScholarships');
const sendMatchingScholarships = require('../../src/services/sendMatchingScholarships');

jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}));
jest.mock('../../src/models/User');
jest.mock('../../src/models/Scholarship');
jest.mock('../../src/daemon/sendEmail');
jest.mock('../../src/utils/buildMatchingScholarships');

describe('sendMatchingScholarships', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send emails to users with matching scholarships', async () => {
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);

    // Mock data
    const users = [
      { userEmail: 'user1@example.com' },
      { userEmail: 'user2@example.com' },
    ];

    const scholarships = [
      { _id: 1, uploadedDate: new Date(today), title: 'Scholarship 1' },
      { _id: 2, uploadedDate: new Date(threeDaysAgo), title: 'Scholarship 2' },
      { _id: 3, uploadedDate: new Date(today - 5 * 24 * 60 * 60 * 1000), title: 'Old Scholarship' },
    ];

    User.find.mockResolvedValue(users);
    Scholarships.find.mockResolvedValue(scholarships);

    // Mock buildMatchingScholarships to return a function that always returns true
    buildMatchingScholarships.mockReturnValue(() => true);

    await sendMatchingScholarships();

    // Expect sendEmailNotification to have been called for each user
    expect(sendEmailNotification).toHaveBeenCalledTimes(users.length);

    users.forEach((user) => {
      expect(sendEmailNotification).toHaveBeenCalledWith({
        email: user.userEmail,
        type: 'sendMatchingScholarships',
        content: expect.any(Array),
      });
    });
  });

  it('should not send emails if no matching scholarships', async () => {
    const today = new Date();

    // Mock data
    const users = [
      { userEmail: 'user1@example.com' },
    ];

    const scholarships = [
      { _id: 1, uploadedDate: new Date(today), title: 'Scholarship 1' },
    ];

    User.find.mockResolvedValue(users);
    Scholarships.find.mockResolvedValue(scholarships);

    // Mock buildMatchingScholarships to return a function that always returns false
    buildMatchingScholarships.mockReturnValue(() => false);

    await sendMatchingScholarships();

    // Expect sendEmailNotification not to be called
    expect(sendEmailNotification).not.toHaveBeenCalled();
  });

  it('should not send emails if no recent scholarships', async () => {
    const today = new Date();

    // Mock data
    const users = [
      { userEmail: 'user1@example.com' },
    ];

    const scholarships = [
      { _id: 1, uploadedDate: new Date(today - 10 * 24 * 60 * 60 * 1000), title: 'Old Scholarship' },
    ];

    User.find.mockResolvedValue(users);
    Scholarships.find.mockResolvedValue(scholarships);

    await sendMatchingScholarships();

    // Expect sendEmailNotification not to be called
    expect(sendEmailNotification).not.toHaveBeenCalled();
  });

  it('should handle empty users array', async () => {
    User.find.mockResolvedValue([]);
    Scholarships.find.mockResolvedValue([]);

    await sendMatchingScholarships();

    // Expect sendEmailNotification not to be called
    expect(sendEmailNotification).not.toHaveBeenCalled();
  });

  it('should handle errors when fetching users', async () => {
    User.find.mockImplementation(() => {
      throw new Error('Database error');
    });

    await expect(sendMatchingScholarships()).resolves.not.toThrow();

    // Expect sendEmailNotification not to be called
    expect(sendEmailNotification).not.toHaveBeenCalled();
  });

  it('should handle errors when fetching scholarships', async () => {
    User.find.mockResolvedValue([{ userEmail: 'user1@example.com' }]);
    Scholarships.find.mockImplementation(() => {
      throw new Error('Database error');
    });

    await expect(sendMatchingScholarships()).resolves.not.toThrow();

    // Expect sendEmailNotification not to be called
    expect(sendEmailNotification).not.toHaveBeenCalled();
  });
});
