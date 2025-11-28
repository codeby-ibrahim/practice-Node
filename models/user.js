const mongoose = require('mongoose');

// Correct MongoDB URL:
mongoose.connect('mongodb://127.0.0.1:27017/MainprojectDB')
    .then(() => console.log("Database Connected"))
    .catch(err => console.log(err));

// Correct schema name (userSchema instead of userShama)
const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    age: Number,
    email: String,
    password: String
});

module.exports = mongoose.model('User', userSchema);
