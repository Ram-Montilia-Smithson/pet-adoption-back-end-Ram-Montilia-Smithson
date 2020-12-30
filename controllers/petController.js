const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const url = "mongodb+srv://Ram:Ct9!7HSWeE@npVB@cluster0.ezysc.mongodb.net/petAdoptionProject?retryWrites=true&w=majority";
const db = mongoose.connection;
const Pet = require("../schemas/petSchema")
db.collection("pets")

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connectede successfully pet controller")
});

// works
const getPets = async (req, res) => {
    Pet.find(function (err, pets) {
        if (err) return console.error(err);
        res.send(pets);
    })
}
// works
const addNewPet = (req, res) => {
    const newPet = req.body;
    const pet = new Pet(newPet) 
    pet.save((function (err, pet) {
        if (err) return console.error(err);
        console.log(pet, "addNewPet");
    }))
    res.send(newPet)
}
// works
const getPetById = async (req, res) => {
    const petId = req.params.id
    console.log(petId, "found pet Id");
    Pet.findOne({_id: ObjectId(petId)} ,function (err, foundPetById) {
        if (err) return console.log(err);
        res.send(foundPetById);
    })
}

// works
const deletePetById = (req, res) => {
    const petId = req.params.id
    Pet.deleteOne({ _id: ObjectId(petId) }, function (err, deletedPetById) {
        if (err) {res.send(err)}
        else if (deletedPetById.n === 0) {res.send("no pet was deleted")}
        else {
            const message = `the pet with the id of ${petId} was deleted`
            res.send(message)
        }
    })
}

// not working
const updatePetById = (req, res) => {
    const { id } = req.params;
    const newPetInfo = req.body;
    const pet = new Pet()
    const PetList = pet.updateById(id, newPetInfo) //convert to mongoos

    res.json(PetList);
}

module.exports = { getPetById, deletePetById, addNewPet, updatePetById, getPets }