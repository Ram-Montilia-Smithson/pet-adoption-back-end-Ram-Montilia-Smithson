const mongoose = require('mongoose');
const url = "mongodb+srv://Ram:Ct9!7HSWeE@npVB@cluster0.ezysc.mongodb.net/petAdoptionProject?retryWrites=true&w=majority";
const db = mongoose.connection;
const Pet = require("../schemas/petSchema")
// const User = require("../schemas/user");
db.collection("pets")
db.collection("users")

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connectede successfully")
});

const getPets = async (req, res) => {
    Pet.find(function (err, pets) {
        if (err) return console.error(err);
        res.send(pets);
    })
}

const getPetById = async (req, res) => {
    const petSchema = new Pet()
    const foundPetById = petSchema.findById(req.params.id) //convert to mongoos
    res.json(foundPetById);
}

const deletePetById = (req, res) => {
    const { id } = req.params;

    const pet = new Pet()
    const petList = pet.deleteById(id) //convert to mongoos

    res.json(petList);
}
const addNewPet = (req, res) => {
    const newPet = req.body;
    const pet = new Pet(newPet) //convert to mongoos
    pet.save((function (err, pet) {
        if (err) return console.error(err);
        console.log(pet);
    }))
    res.send(newPet)
}

const updatePetById = (req, res) => {
    const { id } = req.params;
    const newPetInfo = req.body;
    const pet = new Pet()
    const PetList = pet.updateById(id, newPetInfo) //convert to mongoos

    res.json(PetList);
}

module.exports = { getPetById, deletePetById, addNewPet, updatePetById, getPets }