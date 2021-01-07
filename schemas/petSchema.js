const mongoose = require('mongoose');


const petSchema = new mongoose.Schema({
    name: String,
    type: String,
    image: String,
    breed: String,
    height: Number,
    weight: Number,
    color: String,
    bio: String,
    hypoallergenic: Boolean,
    dietaryRestrictions: String,
    status: String,
    ownerId: Number
});
const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet
