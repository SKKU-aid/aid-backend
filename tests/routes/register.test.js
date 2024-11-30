const request = require('supertest');
const express = require('express');
const User = require('../../src/models/User');
const registerRouter = require('../../src/routes/register');
const createResponse = require('../../src/utils/responseTemplate');

const app = express();
app.use(express.json());
app.use('/', registerRouter);

jest.mock('../../src/models/User');

describe('POST / (Register Route)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 409 if userID already exists', async () => {
        User.findOne.mockResolvedValue({ userID: 'example1' });

        const response = await request(app).post('/').send({
            userID: 'example1',
            userPassword: '1398',
        });

        expect(response.status).toBe(409);
        expect(response.body).toEqual(
            createResponse(false, "This userID already exists", null)
        );
    });

    it('should return 200 and register the user successfully', async () => {
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue({
            userID: 'newUser',
            userPassword: '1398',
        });

        const response = await request(app).post('/').send({
            userID: 'newUser',
            userPassword: '1398',
        });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            createResponse(true, "User has been successfully registered", null)
        );
    });

    it('should return 404 if user creation fails', async () => {
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue(null);

        const response = await request(app).post('/').send({
            userID: 'newUser',
            userPassword: '1398',
        });

        expect(response.status).toBe(404);
        expect(response.body).toEqual(
            createResponse(false, "User not found", null)
        );
    });

    it('should return 500 if an error occurs during registration', async () => {
        User.findOne.mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app).post('/').send({
            userID: 'newUser',
            userPassword: '1398',
        });

        expect(response.status).toBe(500);
        expect(response.body).toEqual(
            createResponse(false, "Failed to register", null)
        );
    });
});

describe('GET /checkID (Check UserID Availability)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if userID is empty', async () => {
        const response = await request(app).get('/checkID').query({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            createResponse(false, "userID is empty", null)
        );
    });

    it('should return 409 if userID already exists', async () => {
        User.findOne.mockResolvedValue({ userID: 'example1' });

        const response = await request(app).get('/checkID').query({
            userID: 'example1',
        });

        expect(response.status).toBe(409);
        expect(response.body).toEqual(
            createResponse(false, "This userID already exists", null)
        );
    });

    it('should return 200 if userID is available', async () => {
        User.findOne.mockResolvedValue(null);

        const response = await request(app).get('/checkID').query({
            userID: 'newUser',
        });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            createResponse(true, "This userID is available", null)
        );
    });

    it('should return 500 if an error occurs during check', async () => {
        User.findOne.mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app).get('/checkID').query({
            userID: 'newUser',
        });

        expect(response.status).toBe(500);
        expect(response.body).toEqual(
            createResponse(false, "Failed to retrieve userID", null)
        );
    });
});
