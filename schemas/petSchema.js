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
    diet: String
});
const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet
