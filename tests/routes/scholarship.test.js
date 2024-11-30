// tests/routes/scholarship.test.js

const request = require('supertest');
const express = require('express');
const Scholarships = require('../../src/models/Scholarship');
const User = require('../../src/models/User');
const scholarshipRouter = require('../../src/routes/scholarships');
const createResponse = require('../../src/utils/responseTemplate');
const compactScholarship = require('../../src/utils/compactScholarship');

const app = express();
app.use(express.json());
app.use('/', scholarshipRouter);

jest.mock('../../src/models/Scholarship');
jest.mock('../../src/models/User');
jest.mock('../../src/utils/compactScholarship');

describe('Scholarship Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return all scholarships with isFav set', async () => {
      const userID = 'exampleUser';

      User.findOne.mockResolvedValue({
        savedScholarship: [1, 2],
      });

      Scholarships.find.mockResolvedValue([
        { _id: 1, title: 'Scholarship 1' },
        { _id: 2, title: 'Scholarship 2' },
        { _id: 3, title: 'Scholarship 3' },
      ]);

      compactScholarship.mockImplementation((scholarship, savedScholarshipIDs) => ({
        _id: scholarship._id,
        title: scholarship.title,
        isFav: savedScholarshipIDs.includes(scholarship._id),
      }));

      const response = await request(app).get('/').query({ userID });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        createResponse(true, "Succesfuly return data", [
          { _id: 1, title: 'Scholarship 1', isFav: true },
          { _id: 2, title: 'Scholarship 2', isFav: true },
          { _id: 3, title: 'Scholarship 3', isFav: false },
        ])
      );
    });

    it('should handle user not found', async () => {
      const userID = 'nonexistentUser';

      User.findOne.mockResolvedValue(null);
      Scholarships.find.mockResolvedValue([
        { _id: 1, title: 'Scholarship 1' },
      ]);

      compactScholarship.mockImplementation((scholarship, savedScholarshipIDs) => ({
        _id: scholarship._id,
        title: scholarship.title,
        isFav: savedScholarshipIDs.includes(scholarship._id),
      }));

      const response = await request(app).get('/').query({ userID });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        createResponse(true, "Succesfuly return data", [
          { _id: 1, title: 'Scholarship 1', isFav: false },
        ])
      );
    });

    it('should handle errors', async () => {
      const userID = 'exampleUser';

      User.findOne.mockImplementation(() => {
        throw new Error('Database error');
      });

      const response = await request(app).get('/').query({ userID });

      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        createResponse(false, "Failed to retrieve scholarships", null)
      );
    });
  });

  describe('GET /:scholarshipID', () => {
    it('should return a specific scholarship', async () => {
      const scholarshipID = 1;
      const userID = 'exampleUser';

      User.findOne.mockResolvedValue({
        savedScholarship: [1, 2],
      });

      Scholarships.findOneAndUpdate.mockResolvedValue({
        _id: 1,
        title: 'Scholarship 1',
      });

      const response = await request(app).get(`/${scholarshipID}`).query({ userID });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        createResponse(true, "Succesfuly return data", {
          _id: 1,
          title: 'Scholarship 1',
        })
      );
    });

    it('should handle scholarship not found', async () => {
      const scholarshipID = 1;
      const userID = 'exampleUser';
    
      User.findOne.mockResolvedValue({
        savedScholarship: [],
      });
    
      Scholarships.findOneAndUpdate.mockResolvedValue(null); // Scholarship not found
    
      const response = await request(app).get(`/${scholarshipID}`).query({ userID });
    
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        createResponse(false, `scholarshipID: ${scholarshipID} doesn't exist`, null)
      );
    });

    it('should handle errors', async () => {
      const scholarshipID = 1;
      const userID = 'exampleUser';

      Scholarships.findOneAndUpdate.mockImplementation(() => {
        throw new Error('Database error');
      });

      const response = await request(app).get(`/${scholarshipID}`).query({ userID });

      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        createResponse(false, "Failed to retrieve scholarship", null)
      );
    });
  });
});
