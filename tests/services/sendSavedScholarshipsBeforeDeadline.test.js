const User = require('../../src/models/User');
const Scholarships = require('../../src/models/Scholarship');
const sendEmailNotification = require('../../src/daemon/sendEmail');
const sendSavedScholarshipsBeforeDeadline = require('../../src/services/sendSavedScholarshipsBeforeDeadline');

jest.mock('node-cron', () => ({
    schedule: jest.fn(),
}));
jest.mock('../../src/models/User');
jest.mock('../../src/models/Scholarship');
jest.mock('../../src/daemon/sendEmail');

describe('sendSavedScholarshipsBeforeDeadline', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send emails to users with saved scholarships about to expire', async () => {
    const today = new Date();
    const twoDaysLater = new Date(today);
    twoDaysLater.setDate(today.getDate() + 2);
    const fourDaysLater = new Date(today);
    fourDaysLater.setDate(today.getDate() + 4);

    const users = [
      { userEmail: 'user1@example.com', savedScholarship: [1, 2] },
      { userEmail: 'user2@example.com', savedScholarship: [2, 3] },
    ];

    const scholarships = [
      {
        _id: 1,
        applicationPeriod: `${today.toISOString().split('T')[0]} ~ ${twoDaysLater.toISOString().split('T')[0]}`,
      },
      {
        _id: 2,
        applicationPeriod: `${today.toISOString().split('T')[0]} ~ ${today.toISOString().split('T')[0]}`,
      },
      {
        _id: 3,
        applicationPeriod: `${today.toISOString().split('T')[0]} ~ ${fourDaysLater.toISOString().split('T')[0]}`,
      },
    ];

    User.find.mockResolvedValue(users);
    Scholarships.find.mockResolvedValue(scholarships);

    await sendSavedScholarshipsBeforeDeadline();

    expect(sendEmailNotification).toHaveBeenCalledTimes(2);

    expect(sendEmailNotification).toHaveBeenCalledWith({
      email: 'user1@example.com',
      type: 'sendSavedScholarshipsBeforeDeadline',
      content: expect.any(Array),
    });

    expect(sendEmailNotification).toHaveBeenCalledWith({
      email: 'user2@example.com',
      type: 'sendSavedScholarshipsBeforeDeadline',
      content: expect.any(Array),
    });
  });

  it('should not send emails when no scholarships are about to expire', async () => {
    const today = new Date();
    const fiveDaysLater = new Date(today);
    fiveDaysLater.setDate(today.getDate() + 5);

    const users = [
      { userEmail: 'user1@example.com', savedScholarship: [1] },
    ];

    const scholarships = [
      {
        _id: 1,
        applicationPeriod: `${today.toISOString().split('T')[0]} ~ ${fiveDaysLater.toISOString().split('T')[0]}`,
      },
    ];

    User.find.mockResolvedValue(users);
    Scholarships.find.mockResolvedValue(scholarships);

    await sendSavedScholarshipsBeforeDeadline();

    expect(sendEmailNotification).not.toHaveBeenCalled();
  });

  it('should handle users with no saved scholarships', async () => {
    const users = [
      { userEmail: 'user1@example.com', savedScholarship: [] },
    ];

    const scholarships = [
      {
        _id: 1,
        applicationPeriod: '2024-11-25 ~ 2023-11-31',
      },
    ];

    User.find.mockResolvedValue(users);
    Scholarships.find.mockResolvedValue(scholarships);

    await sendSavedScholarshipsBeforeDeadline();

    expect(sendEmailNotification).not.toHaveBeenCalled();
  });

  it('should handle scholarships without applicationPeriod', async () => {
    const users = [
      { userEmail: 'user1@example.com', savedScholarship: [1] },
    ];

    const scholarships = [
      {
        _id: 1,
        // applicationPeriod가 없음
      },
    ];

    User.find.mockResolvedValue(users);
    Scholarships.find.mockResolvedValue(scholarships);

    await sendSavedScholarshipsBeforeDeadline();

    expect(sendEmailNotification).not.toHaveBeenCalled();
  });

  it('should handle errors when fetching users', async () => {
    User.find.mockRejectedValue(new Error('Database error'));

    await expect(sendSavedScholarshipsBeforeDeadline()).resolves.not.toThrow();

    expect(sendEmailNotification).not.toHaveBeenCalled();
  });

  it('should handle errors when fetching scholarships', async () => {
    const users = [
      { userEmail: 'user1@example.com', savedScholarship: [1] },
    ];

    User.find.mockResolvedValue(users);
    Scholarships.find.mockRejectedValue(new Error('Database error'));

    await expect(sendSavedScholarshipsBeforeDeadline()).resolves.not.toThrow();

    expect(sendEmailNotification).not.toHaveBeenCalled();
  });
});
