require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 8082;
const cors = require('cors')

// Middleware to parse JSON data
app.use(express.json());
//To resolve access problem
app.use(cors());

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;
console.log(mongoURI);
mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Import routes
const userRoutes = require('./src/routes/users');
const scholarshipRoutes = require('./src/routes/scholarships');
const login = require('./src/routes/login');
const register = require('./src/routes/register');

// Use routes
app.use('/users', userRoutes);
app.use('/scholarships', scholarshipRoutes);
app.use('/login', login);
app.use('/register', register);

//run services
require('./src/services/sendSavedScholarshipsBeforeDeadline');
require('./src/services/sendMatchingScholarships');
require('./src/services/sendUpdatedSavedScholarships');

app.listen(port, () => {
    console.log(`Server running on port ${port}`);

});
