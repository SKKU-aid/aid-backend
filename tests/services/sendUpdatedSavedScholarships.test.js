const User = require('../../src/models/User');
const Scholarships = require('../../src/models/Scholarship');
const sendEmailNotification = require('../../src/daemon/sendEmail');
const sendUpdatedSavedScholarships = require('../../src/services/sendUpdatedSavedScholarships');

jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}));
jest.mock('../../src/models/User');
jest.mock('../../src/models/Scholarship');
jest.mock('../../src/daemon/sendEmail');

describe('sendUpdatedSavedScholarships', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send emails and update scholarships when there are updated saved scholarships', async () => {
    const users = [
      { userEmail: 'user1@example.com', savedScholarship: [1, 2] },
    ];

    const scholarships = [
      {
        _id: 1,
        lastUploadedDate: new Date('2024-11-01'),
        uploadedDate: new Date('2024-11-30'),
      },
      {
        _id: 2,
        lastUploadedDate: new Date('2024-11-30'),
        uploadedDate: new Date('2024-11-30'),
      },
      {
        _id: 3,
        lastUploadedDate: null,
        uploadedDate: new Date('2024-11-30'),
      },
    ];

    User.find.mockResolvedValue(users);
    Scholarships.find.mockResolvedValue(scholarships);
    Scholarships.updateMany.mockResolvedValue({ modifiedCount: 1 });

    await sendUpdatedSavedScholarships();

    expect(sendEmailNotification).toHaveBeenCalledTimes(1);

    expect(sendEmailNotification).toHaveBeenCalledWith({
      email: 'user1@example.com',
      type: 'sendUpdatedSavedScholarships',
      content: [
        scholarships[0],
      ],
    });

    expect(Scholarships.updateMany).toHaveBeenCalledTimes(1);
    expect(Scholarships.updateMany).toHaveBeenCalledWith(
      { _id: { $in: [1] } },
      [{ $set: { lastUploadedDate: "$uploadedDate" } }]
    );
  });

  it('should not send emails or update scholarships when there are no updated saved scholarships', async () => {
    const users = [
      { userEmail: 'user1@example.com', savedScholarship: [2] },
    ];

    const scholarships = [
      {
        _id: 2,
        lastUploadedDate: new Date('2024-11-30'),
        uploadedDate: new Date('2024-11-30'), // 업데이트되지 않음
      },
    ];

    User.find.mockResolvedValue(users);
    Scholarships.find.mockResolvedValue(scholarships);

    await sendUpdatedSavedScholarships();

    expect(sendEmailNotification).not.toHaveBeenCalled();
    expect(Scholarships.updateMany).not.toHaveBeenCalled();
  });

  it('should handle errors when fetching users', async () => {
    User.find.mockRejectedValue(new Error('Database error'));

    await expect(sendUpdatedSavedScholarships()).resolves.not.toThrow();

    expect(sendEmailNotification).not.toHaveBeenCalled();
    expect(Scholarships.updateMany).not.toHaveBeenCalled();
  });

  it('should handle errors when fetching scholarships', async () => {
    const users = [
      { userEmail: 'user1@example.com', savedScholarship: [1] },
    ];

    User.find.mockResolvedValue(users);
    Scholarships.find.mockRejectedValue(new Error('Database error'));

    await expect(sendUpdatedSavedScholarships()).resolves.not.toThrow();

    expect(sendEmailNotification).not.toHaveBeenCalled();
    expect(Scholarships.updateMany).not.toHaveBeenCalled();
  });
});
