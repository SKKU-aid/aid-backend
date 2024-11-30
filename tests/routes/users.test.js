// tests/routes/users.test.js

const request = require('supertest');
const express = require('express');
const User = require('../../src/models/User');
const Scholarship = require('../../src/models/Scholarship');
const userRouter = require('../../src/routes/users');
const createResponse = require('../../src/utils/responseTemplate');
const compactScholarship = require('../../src/utils/compactScholarship');
const sendEmailNotification = require('../../src/daemon/sendEmail');
const generateVerificationCode = require('../../src/daemon/verificationCode');
const buildMatchingScholarships = require('../../src/utils/buildMatchingScholarships');

const app = express();
app.use(express.json());
app.use('/', userRouter);

jest.mock('../../src/models/User');
jest.mock('../../src/models/Scholarship');
jest.mock('../../src/utils/compactScholarship');
jest.mock('../../src/daemon/sendEmail');
jest.mock('../../src/daemon/verificationCode');
jest.mock('../../src/utils/buildMatchingScholarships');

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /:userID', () => {
    it('should retrieve user info successfully', async () => {
      const userID = 'exampleUser';
      User.findOne.mockResolvedValue({ userID, name: 'John Doe' });
      const response = await request(app).get(`/${userID}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        createResponse(true, "user information has been successfully retrieved", { userID, name: 'John Doe' })
      );
    });

    it('should return 404 if user not found', async () => {
      const userID = 'nonexistentUser';
      User.findOne.mockResolvedValue(null);
      const response = await request(app).get(`/${userID}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        createResponse(false, "userID doesn't exist in DB", null)
      );
    });

    it('should handle errors', async () => {
      const userID = 'exampleUser';
      User.findOne.mockImplementation(() => {
        throw new Error('Database error');
      });
      const response = await request(app).get(`/${userID}`);
      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        createResponse(false, "Failed to retrieve user", null)
      );
    });
  });

  describe('PUT /:userID/update-info', () => {
    it('should update user info successfully', async () => {
      const userID = 'exampleUser';
      const updateData = { name: 'Jane Doe' };
      User.findOne.mockResolvedValue({ userID });
      User.findOneAndUpdate.mockResolvedValue({ userID, ...updateData });
      const response = await request(app).put(`/${userID}/update-info`).send(updateData);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        createResponse(true, "user information has been successfully updated", updateData)
      );
    });

    it('should return 404 if user not found', async () => {
      const userID = 'nonexistentUser';
      const updateData = { name: 'Jane Doe' };
      User.findOne.mockResolvedValue(null);
  
      const response = await request(app)
        .put(`/${userID}/update-info`)
        .send(updateData);
  
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        createResponse(false, "userID doesn't exist in DB", null)
      );
      expect(User.findOne).toHaveBeenCalledWith({ userID: userID });
    });

    it('should handle errors', async () => {
      const userID = 'exampleUser';
      const updateData = { name: 'Jane Doe' };
      User.findOne.mockImplementation(() => {
        throw new Error('Database error');
      });
      const response = await request(app).put(`/${userID}/update-info`).send(updateData);
      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        createResponse(false, "Failed to retrieve user", null)
      );
    });
  });

  describe('POST /:userID/verify', () => {
    it('should generate verification code successfully', async () => {
      const userID = 'exampleUser';
      const verifyCode = '123456';
      User.findOne.mockResolvedValue({ userID, userEmail: 'user@example.com' });
      generateVerificationCode.mockReturnValue(verifyCode);
      User.findOneAndUpdate.mockResolvedValue();
      const response = await request(app).post(`/${userID}/verify`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        createResponse(true, "verification code has been successfully generated", {})
      );
      expect(sendEmailNotification).toHaveBeenCalledWith({
        email: 'user@example.com',
        type: 'verification',
        content: { verifyCode },
      });
    });

    it('should return 404 if user not found', async () => {
      const userID = 'nonexistentUser';
      User.findOne.mockResolvedValue(null);
      const response = await request(app).post(`/${userID}/verify`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        createResponse(false, "userID doesn't exist in DB", null)
      );
    });

    it('should handle errors', async () => {
      const userID = 'exampleUser';
      User.findOne.mockImplementation(() => {
        throw new Error('Database error');
      });
      const response = await request(app).post(`/${userID}/verify`);
      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        createResponse(false, "Failed to retrieve user", null)
      );
    });
  });

  describe('POST /:userID/check-verify', () => {
    it('should verify code successfully', async () => {
      const userID = 'exampleUser';
      const verifyCode = '123456';
      const requestBody = { userID, verifyCode };
      const user = {
        userID,
        verifyCode,
        verifyCodeCreatedAt: new Date(),
      };
      User.findOne.mockResolvedValue(user);
      const response = await request(app).post(`/${userID}/check-verify`).send(requestBody);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        createResponse(true, "verification code is correct", requestBody)
      );
    });

    it('should return 404 if verification code is wrong', async () => {
      const userID = 'exampleUser';
      const verifyCode = 'wrongCode';
      const requestBody = { userID, verifyCode };
      const user = {
        userID,
        verifyCode: '123456',
        verifyCodeCreatedAt: new Date(),
      };
      User.findOne.mockResolvedValue(user);
      const response = await request(app).post(`/${userID}/check-verify`).send(requestBody);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        createResponse(false, "verificataion code is wrong", null)
      );
    });

    it('should return 404 if verification code is expired', async () => {
      const userID = 'exampleUser';
      const verifyCode = '123456';
      const requestBody = { userID, verifyCode };
      const user = {
        userID,
        verifyCode,
        verifyCodeCreatedAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      };
      User.findOne.mockResolvedValue(user);
      const response = await request(app).post(`/${userID}/check-verify`).send(requestBody);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        createResponse(false, "verificataion code is expired", null)
      );
    });

    it('should handle errors', async () => {
      const userID = 'exampleUser';
      const verifyCode = '123456';
      const requestBody = { userID, verifyCode };
      User.findOne.mockImplementation(() => {
        throw new Error('Database error');
      });
      const response = await request(app).post(`/${userID}/check-verify`).send(requestBody);
      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        createResponse(false, "Failed to retrieve user", null)
      );
    });

    it('should return 404 if user not found', async () => {
      const userID = 'nonexistentUser';
      const verifyCode = '123456';
      const requestBody = { userID, verifyCode };
  
      User.findOne.mockResolvedValue(null);
  
      console.error = jest.fn();
  
      const response = await request(app).post(`/${userID}/check-verify`).send(requestBody);
  
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        createResponse(false, "userID doesn't exist in DB", null)
      );
  
      expect(console.error).toHaveBeenCalledWith(`User with user_id: ${userID} doesn't exist`);
    });
  });

  describe('PUT /:userID/change-pw', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should update user password successfully when verifyCode is correct', async () => {
      const requestBody = {
        userID: 'exampleUser',
        verifyCode: 'validCode123',
        updatePassword: 'newPassword',
      };
      const user = {
        userID: 'exampleUser',
        verifyCode: 'validCode123',
        verifyCodeCreatedAt: new Date(),
      };
      User.findOne.mockResolvedValue(user);
      User.findOneAndUpdate.mockResolvedValue();
  
      const response = await request(app).put(`/${requestBody.userID}/change-pw`).send(requestBody);
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        createResponse(true, "user password has been successfully updated", null)
      );
      expect(User.findOne).toHaveBeenCalledWith({ userID: requestBody.userID });
      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { userID: requestBody.userID },
        { userPassword: requestBody.updatePassword }
      );
    });
  
    it('should return 404 if user not found', async () => {
      const requestBody = {
        userID: 'nonexistentUser',
        verifyCode: 'validCode123',
        updatePassword: 'newPassword',
      };
      User.findOne.mockResolvedValue(null);
  
      const response = await request(app).put(`/${requestBody.userID}/change-pw`).send(requestBody);
  
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        createResponse(false, "userID doesn't exist in DB", null)
      );
      expect(User.findOneAndUpdate).not.toHaveBeenCalled();
    });
  
    it('should return 404 if verification code is wrong', async () => {
      const requestBody = {
        userID: 'exampleUser',
        verifyCode: 'wrongCode',
        updatePassword: 'newPassword',
      };
      const user = {
        userID: 'exampleUser',
        verifyCode: 'validCode123',
        verifyCodeCreatedAt: new Date(),
      };
      User.findOne.mockResolvedValue(user);
  
      const response = await request(app).put(`/${requestBody.userID}/change-pw`).send(requestBody);
  
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        createResponse(false, "verification code is wrong", null)
      );
      expect(User.findOneAndUpdate).not.toHaveBeenCalled();
    });
  
    it('should return 404 if verification code or createdAt is missing', async () => {
      const requestBody = {
        userID: 'exampleUser',
        verifyCode: 'validCode123',
        updatePassword: 'newPassword',
      };
      const user = {
        userID: 'exampleUser',
        // verifyCode: 'validCode123', // 누락된 경우
        // verifyCodeCreatedAt: new Date(), // 누락된 경우
      };
      User.findOne.mockResolvedValue(user);
  
      const response = await request(app).put(`/${requestBody.userID}/change-pw`).send(requestBody);
  
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        createResponse(false, "verification code is wrong", null)
      );
      expect(User.findOneAndUpdate).not.toHaveBeenCalled();
    });
  
    it('should handle errors and return 500', async () => {
      const requestBody = {
        userID: 'exampleUser',
        verifyCode: 'validCode123',
        updatePassword: 'newPassword',
      };
      User.findOne.mockImplementation(() => {
        throw new Error('Database error');
      });
  
      const response = await request(app).put(`/${requestBody.userID}/change-pw`).send(requestBody);
  
      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        createResponse(false, "Failed to retrieve user", null)
      );
      expect(User.findOneAndUpdate).not.toHaveBeenCalled();
    });
  });

  describe('PUT /:userID/update-pw', () => {
    it('should update user password successfully', async () => {
      const requestBody = {
        userID: 'exampleUser',
        currentPassword: 'oldPassword',
        updatePassword: 'newPassword',
      };
      const user = {
        userID: 'exampleUser',
        userPassword: 'oldPassword',
      };
      User.findOne.mockResolvedValue(user);
      User.findOneAndUpdate.mockResolvedValue();
      const response = await request(app).put(`/${requestBody.userID}/update-pw`).send(requestBody);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        createResponse(true, "user password has been successfully updated", null)
      );
    });

    it('should return 404 if user not found', async () => {
      const requestBody = {
        userID: 'nonexistentUser',
        currentPassword: 'oldPassword',
        updatePassword: 'newPassword',
      };
      User.findOne.mockResolvedValue(null);
      const response = await request(app).put(`/${requestBody.userID}/update-pw`).send(requestBody);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        createResponse(false, "userID doesn't exist in DB", null)
      );
    });

    it('should return 404 if current password is incorrect', async () => {
      const requestBody = {
        userID: 'exampleUser',
        currentPassword: 'wrongPassword',
        updatePassword: 'newPassword',
      };
      const user = {
        userID: 'exampleUser',
        userPassword: 'oldPassword',
      };
      User.findOne.mockResolvedValue(user);
      const response = await request(app).put(`/${requestBody.userID}/update-pw`).send(requestBody);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        createResponse(false, "Wrong password", null)
      );
    });

    it('should handle errors', async () => {
      const requestBody = {
        userID: 'exampleUser',
        currentPassword: 'oldPassword',
        updatePassword: 'newPassword',
      };
      User.findOne.mockImplementation(() => {
        throw new Error('Database error');
      });
      const response = await request(app).put(`/${requestBody.userID}/update-pw`).send(requestBody);
      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        createResponse(false, "Failed to retrieve user", null)
      );
    });
  });

  describe('GET /:userID/scholarships', () => {
    it('should return recommended scholarships successfully', async () => {
      const userID = 'exampleUser';
      const type = 'custom';
      const user = {
        savedScholarship: [1, 2],
        birthday: '1990-01-01',
      };
      const scholarships = [
        { _id: 1, title: 'Scholarship 1' },
        { _id: 2, title: 'Scholarship 2' },
        { _id: 3, title: 'Scholarship 3' },
      ];
      User.findOne.mockResolvedValue(user);
      Scholarship.find.mockResolvedValue(scholarships);
      buildMatchingScholarships.mockReturnValue(() => true);
      compactScholarship.mockImplementation((scholarship, savedScholarshipIDs) => ({
        _id: scholarship._id,
        title: scholarship.title,
        isFav: savedScholarshipIDs.includes(scholarship._id),
      }));
      const response = await request(app).get(`/${userID}/scholarships`).query({ type });
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        createResponse(true, "Succesfuly return data", [
          { _id: 1, title: 'Scholarship 1', isFav: true },
          { _id: 2, title: 'Scholarship 2', isFav: true },
          { _id: 3, title: 'Scholarship 3', isFav: false },
        ])
      );
    });

    it('should return 400 if type is not custom', async () => {
      const userID = 'exampleUser';
      const type = 'other';
      const response = await request(app).get(`/${userID}/scholarships`).query({ type });
      expect(response.status).toBe(400);
      expect(response.body).toEqual(
        createResponse(false, "type is not custom", null)
      );
    });

    it('should return 404 if user not found', async () => {
      const userID = 'nonexistentUser';
      const type = 'custom';
      User.findOne.mockResolvedValue(null);
      const response = await request(app).get(`/${userID}/scholarships`).query({ type });
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        createResponse(false, `userID: ${userID} doesn't exist`, null)
      );
    });

    it('should handle errors', async () => {
      const userID = 'exampleUser';
      const type = 'custom';
      User.findOne.mockImplementation(() => {
        throw new Error('Database error');
      });
      const response = await request(app).get(`/${userID}/scholarships`).query({ type });
      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        createResponse(false, "Failed to retrieve scholarships for user", null)
      );
    });
  });

  describe('GET /:userID/fav-scholarships', () => {
    it('should return saved scholarships successfully', async () => {
      const userID = 'exampleUser';
      const user = {
        savedScholarship: [1, 2],
      };
      const scholarships = [
        { _id: 1, title: 'Scholarship 1' },
        { _id: 2, title: 'Scholarship 2' },
      ];
      User.findOne.mockResolvedValue(user);
      Scholarship.find.mockResolvedValue(scholarships);
      compactScholarship.mockImplementation((scholarship, savedScholarshipIDs) => ({
        _id: scholarship._id,
        title: scholarship.title,
        isFav: true,
      }));
      const response = await request(app).get(`/${userID}/fav-scholarships`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        createResponse(true, "Succesfuly return data", [
          { _id: 1, title: 'Scholarship 1', isFav: true },
          { _id: 2, title: 'Scholarship 2', isFav: true },
        ])
      );
    });

    it('should return 404 if user not found', async () => {
      const userID = 'nonexistentUser';
      
      User.findOne.mockResolvedValue(null);
  
      const response = await request(app).get(`/${userID}/fav-scholarships`);
  
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        createResponse(false, `userID: ${userID} doesn't exist`, null)
      );
      expect(User.findOne).toHaveBeenCalledWith({ userID: userID }, 'savedScholarship');
    });

    it('should return 404 if scholarships not found', async () => {
      const userID = 'exampleUser';
      const user = {
        savedScholarship: [1, 2],
      };
      User.findOne.mockResolvedValue(user);
      Scholarship.find.mockResolvedValue([]);
  
      const response = await request(app).get(`/${userID}/fav-scholarships`);
  
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        createResponse(false, "fail to get scholarships from DB", null)
      );
    });

    it('should handle errors', async () => {
      const userID = 'exampleUser';
      User.findOne.mockImplementation(() => {
        throw new Error('Database error');
      });
      const response = await request(app).get(`/${userID}/fav-scholarships`);
      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        createResponse(false, "Failed to retrieve favorite scholarships", null)
      );
    });
  });

  describe('POST /:userID/fav-scholarships', () => {
    it('should add scholarship to favorites successfully', async () => {
      const requestBody = {
        userID: 'exampleUser',
        scholarshipID: 3,
      };
      const user = {
        savedScholarship: [1, 2],
      };
      User.findOne.mockResolvedValue(user);
      User.findOneAndUpdate.mockResolvedValue();
      const response = await request(app).post(`/${requestBody.userID}/fav-scholarships`).send(requestBody);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        createResponse(true, "Favorite scholarships has been successfully deleted", null)
      );
    });

    it('should return 404 if user not found', async () => {
      const requestBody = {
        userID: 'nonexistentUser',
        scholarshipID: 3,
      };
      User.findOne.mockResolvedValue(null);
      const response = await request(app).post(`/${requestBody.userID}/fav-scholarships`).send(requestBody);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        createResponse(false, "User not found", null)
      );
    });

    it('should return 404 if scholarship already in favorites', async () => {
      const requestBody = {
        userID: 'exampleUser',
        scholarshipID: 2,
      };
      const user = {
        savedScholarship: [1, 2],
      };
      User.findOne.mockResolvedValue(user);
      const response = await request(app).post(`/${requestBody.userID}/fav-scholarships`).send(requestBody);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        createResponse(false, "Favorite scholarship already exists", null)
      );
    });

    it('should handle errors', async () => {
      const requestBody = {
        userID: 'exampleUser',
        scholarshipID: 3,
      };
      User.findOne.mockImplementation(() => {
        throw new Error('Database error');
      });
      const response = await request(app).post(`/${requestBody.userID}/fav-scholarships`).send(requestBody);
      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        createResponse(false, "Failed to add favorite scholarships", null)
      );
    });
  });

  describe('DELETE /:userID/fav-scholarships', () => {
    it('should delete scholarship from favorites successfully', async () => {
      const requestBody = {
        userID: 'exampleUser',
        scholarshipID: 2,
      };
      const user = {
        savedScholarship: [1, 2],
      };
      User.findOne.mockResolvedValue(user);
      User.findOneAndUpdate.mockResolvedValue();
      const response = await request(app).delete(`/${requestBody.userID}/fav-scholarships`).send(requestBody);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        createResponse(true, "Favorite scholarships has been successfully added", null)
      );
    });

    it('should return 404 if user not found', async () => {
      const requestBody = {
        userID: 'nonexistentUser',
        scholarshipID: 2,
      };
      User.findOne.mockResolvedValue(null);
      const response = await request(app).delete(`/${requestBody.userID}/fav-scholarships`).send(requestBody);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        createResponse(false, "User not found", null)
      );
    });

    it('should return 404 if scholarship not in favorites', async () => {
      const requestBody = {
        userID: 'exampleUser',
        scholarshipID: 3,
      };
      const user = {
        savedScholarship: [1, 2],
      };
      User.findOne.mockResolvedValue(user);
      const response = await request(app).delete(`/${requestBody.userID}/fav-scholarships`).send(requestBody);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        createResponse(false, "Favorite scholarship does not exit", null)
      );
    });

    it('should handle errors', async () => {
      const requestBody = {
        userID: 'exampleUser',
        scholarshipID: 2,
      };
      User.findOne.mockImplementation(() => {
        throw new Error('Database error');
      });
      const response = await request(app).delete(`/${requestBody.userID}/fav-scholarships`).send(requestBody);
      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        createResponse(false, "Failed to add favorite scholarships", null)
      );
    });
  });
});
