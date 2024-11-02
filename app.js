const express = require('express')
const app = express();
const port = 8082

// Middleware to parse JSON data
app.use(express.json());

// registerUser
app.post('/register', (req, res) => {

});

// checkIDReplicated
app.get('/register/checkID', (req, res) => {

});

// getUserInfo
app.get('/users/:userID', (req, res) => {


});

// updateUserInfo
app.put('/users/:userID/update-info', (req, res) => {

});

// updateUserPassWord
app.put('/users/:userID/update-pw', (req, res) => {

});

// checkRegisterdUser, userLogin
app.post('/login', (req, res) => {

});

// getScholarshipAll
app.get('/scholarships', (req, res) => {
});

// getScholarship
app.get('/scholarships/:scholarshipID', (req, res) => {

});

// getRecommandedScholarshipInfo
app.get('/user/:userID/scholarships', (req, res) => {

});

// getSavedScholarshipsInfo
app.get('/users/:userID/fav-scholarships', (req, res) => {

});

// addSavedScholarship
app.post('/users/:userID/fav-scholarships', (req, res) => {

});

// deleteSavedScholarship
app.delete('/users/:userID/fav-scholarships/:scholarshipID', (req, res) => {

});

app.listen(port, () => {
    console.log('listening on 8082');
});
