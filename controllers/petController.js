const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const url = "mongodb+srv://Ram:Ct9!7HSWeE@npVB@cluster0.ezysc.mongodb.net/petAdoptionProject?retryWrites=true&w=majority";
const db = mongoose.connection;
const Pet = require("../schemas/petSchema")
// const multer = require('multer')
// const cloudinary = require('cloudinary').v2;

db.collection("pets")

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connectede successfully pet controller")
});

// cloudinary.config({
    // cloud_name: 'pet-image-cloud',
    // api_key: '477269894866243',
    // api_secret: '8c5bqcREahOR6ulEUbraisngmDY'
    // CLOUDINARY_URL=cloudinary://477269894866243:8c5bqcREahOR6ulEUbraisngmDY@pet-image-cloud
// });

// const storage = multer.diskStorage({
    // destination: function (req, file, cb) {
        // console.log("file", file, "req", req);
        // cb(null, './images')
    // },
    // filename: function (req, file, cb) {
        // cb(null, file.originalname)
    // }
// })
// const upload = multer({ storage })

// works
const getPets = async (req, res) => {
    Pet.find(function (err, pets) {
        if (err) return console.error(err);
        res.send(pets);
    })
}
// works with images, in server

// const addNewPet = (req, res) => {
//     const newPet = req.body;
//     const pet = new Pet(newPet)
//     pet.save((function (err, pet) {
//         if (err) return console.error(err);
//         console.log(pet, "addNewPet");
//     }))
//     res.send(newPet)
// }

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

module.exports = { getPetById, deletePetById, updatePetById, getPets }