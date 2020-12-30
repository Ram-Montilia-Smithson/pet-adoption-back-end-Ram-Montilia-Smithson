const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    admin: Boolean,
    login: Boolean,
    password: String,
    email: String,
    firstName: String, 
    lastName: String,
    tel: Number,
    bio: String
});
const User = mongoose.model('User', userSchema);

module.exports = User