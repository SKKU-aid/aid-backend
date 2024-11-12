
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 8082;


// Middleware to parse JSON data
app.use(express.json());

// Connect to MongoDB
const mongoURI = 'mongodb://root:1398@mongo:27017/auth?authSource=admin';
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const userRoutes = require('./src/routes/users');
const scholarshipRoutes = require('./src/routes/scholarships');
const login=require('./src/routes/login');
const register=require('./src/routes/register');

// Use routes
app.use('/users', userRoutes);
app.use('/scholarships', scholarshipRoutes);
app.use('/login', login);
app.use('/register', register);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);

});
