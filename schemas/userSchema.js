const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    admin: Boolean,
    login: Boolean,
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firstName: String, 
    lastName: String,
    tel: Number,
    bio: String,
    savedPets: Array
});

const User = mongoose.model('User', userSchema);

module.exports = User