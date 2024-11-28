const request = require('supertest'); // For making HTTP requests
const express = require('express');  // Express app for mocking
const User = require('../../src/models/User'); // Mocked User model
const loginRouter = require('../../src/routes/login'); // Router to test
const createResponse = require('../../src/utils/responseTemplate');

// Mock the Express app
const app = express();
app.use(express.json());
app.use('/', loginRouter);

// Mock the User model
jest.mock('../../src/models/User');

describe('POST / (Login Route)', () => {
    it('should return 404 if userID is not found', async () => {
        // Mock User.findOne to return null
        User.findOne.mockResolvedValue(null);

        const response = await request(app).post('/').send({
            userID: 'nononono',
            userPassword: '1398',
        });

        expect(response.status).toBe(404);
        expect(response.body).toEqual(createResponse(false, "Wrong userID", null));
    });

    it('should return 404 if password is incorrect', async () => {
        // Mock User.findOne to return a user
        User.findOne.mockResolvedValue({
            userID: 'example1@skku.edu'
        });

        const response = await request(app).post('/').send({
            userID: 'example1@skku.edu',
            userPassword: '1234',
        });

        expect(response.status).toBe(404);
        expect(response.body).toEqual(createResponse(false, "Wrong password", null));
    });

    it('should return 200 and success response if login is successful', async () => {
        // Mock User.findOne to return a valid user
        User.findOne.mockResolvedValue({
            userID: 'example1@skku.edu',
            userPassword: '1398',
        });

        const response = await request(app).post('/').send({
            userID: 'example1@skku.edu',
            userPassword: '1398',
        });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            createResponse(true, "Log in successfully", { userID: 'example1@skku.edu' })
        );
    });

    it('should return 500 if an error occurs', async () => {
        // Mock User.findOne to throw an error
        User.findOne.mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app).post('/').send({
            userID: 'example1@skku.edu',
            userPassword: '1398',
        });

        expect(response.status).toBe(500);
        expect(response.body).toEqual(
            createResponse(false, "Failed to retrieve user", null)
        );
    });
});
