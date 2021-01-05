const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const url = "mongodb+srv://Ram:Ct9!7HSWeE@npVB@cluster0.ezysc.mongodb.net/petAdoptionProject?retryWrites=true&w=majority";
const db = mongoose.connection;
const Pet = require("../schemas/petSchema")
const cloudinary = require('cloudinary').v2;
const fs = require('fs')

db.collection("pets")

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connectede successfully pet controller")
});

cloudinary.config({
    cloud_name: 'pet-image-cloud',
    api_key: '477269894866243',
    api_secret: '8c5bqcREahOR6ulEUbraisngmDY'
    // CLOUDINARY_URL=cloudinary://477269894866243:8c5bqcREahOR6ulEUbraisngmDY@pet-image-cloud
});


// works
const getPets = async (req, res) => {
    Pet.find(function (err, pets) {
        if (err) return console.error(err);
        res.send(pets);
    })
}
// works with cloudinary
const addNewPet = (req, res) => {
    console.log(req.body);
    console.log("req-file-path",req.file.path);
    const path = req.file.path
    cloudinary.uploader.upload(
        path,
        { public_id: `pet-adoption-images/${req.body.name}-${new Date()}` },
        function (err, image) {
            // , "connection error, pet was not saved"
            if (err) { res.status(500).send(err) }
            else {
                console.log('image uploaded to Cloudinary')
                fs.unlinkSync(path)
                const newPet = req.body;
                const pet = new Pet(newPet)
                pet.image = image.secure_url
                pet.save((function (err, pet) {
                    // , "connection error, pet was not saved"
                    if (err) { return res.status(500).send(err) }
                    // "pet added"
                    else {
                        console.log(pet);
                        return res.status(200).send(pet)
                    }
                }))
            }
        }
    )
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

// works
const updatePetById = (req, res) => {
    const petId = req.params.id
    Pet.findOneAndUpdate(
        // finding the doc
        { _id: ObjectId(petId) },
        // update the doc - req.body
        { bio: 'new bio' },
        // options
        { new: true, useFindAndModify: false },
        // cb
        function (err, updatedPet) {
            if (err) { res.send(err) }
            // console.log(err)
            // else if()
            else {
                // console.log(update);
                res.send(updatedPet)
            }
        })
}

module.exports = { getPetById, deletePetById, updatePetById, getPets, addNewPet }