const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const url = "mongodb+srv://Ram:Ct9!7HSWeE@npVB@cluster0.ezysc.mongodb.net/petAdoptionProject?retryWrites=true&w=majority";
const db = mongoose.connection;
const Pet = require("../schemas/petSchema")
const cloudinary = require('cloudinary').v2;
const fs = require('fs')
require("dotenv").config();

db.collection("pets")

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connected successfully pet controller")
});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


const getPets = (req, res) => {
    Pet.find((err, pets) => {
        if (err) res.send('error connecting to mongo please try again')
        else if (pets) {res.json(pets)}
    })
}

const addNewPet = (req, res) => {
    // console.log(req.body);
    // console.log("req-file-path", req.file.path);
    const path = req.file.path
    cloudinary.uploader.upload(
        path,
        { public_id: `pet-adoption-images/${req.body.name}-${new Date().toISOString()}` },
        (err, image) => {
            // , "connection error, new pet was not saved"
            if (err) {
                res.status(500).send(err)
            }
            else {
                console.log('image uploaded to Cloudinary')
                fs.unlinkSync(path)
                const newPet = req.body;
                const pet = new Pet(newPet)
                pet.image = image.secure_url
                pet.save(((err, pet) => {
                    // , "connection error, new pet was not saved"
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
const updatePetById = (req, res) => {
    const petId = req.params.id
    if (req.file) {
        const path = req.file.path
        cloudinary.uploader.upload(
            path,
            { public_id: `pet-adoption-images/${req.body.name}-${new Date().toISOString()}` },
            (err, image) => {
                // , "connection error, new pet was not saved"
                if (err) {
                    res.status(500).send(err)
                }
                else {
                    console.log('image uploaded to Cloudinary')
                    fs.unlinkSync(path)
                    const updatedPet = req.body;
                    updatedPet.image = image.secure_url
                    Pet.findOneAndUpdate(
                        // finding the doc
                        { _id: ObjectId(petId) },
                        // update the doc - req.body
                        req.body,
                        // options
                        { new: true, useFindAndModify: false },
                        (err, updatedPet) => {
                            if (err) { res.send(err) }
                            else { res.send(updatedPet) }
                            console.log(updatedPet);
                        }
                    )
                }
            }
        )
    }
    else if (!req.file) {
        Pet.findOneAndUpdate(
            // finding the doc
            { _id: ObjectId(petId) },
            // update the doc - req.body
            req.body,
            // options
            { new: true, useFindAndModify: false },
            (err, updatedPet) => {
                if (err) { res.send(err) }
                else { res.send(updatedPet) }
                console.log(updatedPet);
            }
        )
    }
}
    
    const getPetById = (req, res) => {
        const petId = req.params.id
        // console.log(petId, "found pet Id");
    Pet.findOne({_id: ObjectId(petId)} ,(err, foundPetById) => {
        if (err) res.send(`${err} error connecting to mongo please try again`)
        else if (!foundPetById) { res.send("didn't find pet") }
        else if (foundPetById) { res.json(foundPetById); }
    })
}

// needs fixing
// const deletePetById = (req, res) => {
//     const petId = req.params.id
//     Pet.deleteOne({ _id: ObjectId(petId) }, function (err, deletedPetById) {
//         if (err) {res.send(err)}
//         else if (deletedPetById.n === 0) {res.send("no pet was deleted")}
//         else {
//             const message = `the pet with the id of ${petId} was deleted`
//             res.send(message)
//         }
//     })
// }

const adoptPet = (req, res) => {
    // console.log(req.params.id, req.body);
    const petId = req.params.id
    const userId = req.body.user
    Pet.findOneAndUpdate(
        // finding the doc
        { _id: ObjectId(petId) },
        // update the doc - req.body
        {
            ownerId: ObjectId(userId),
            status: "Adopted"
        },
        // options
        { new: true, useFindAndModify: false },
        (err, updatedPet) => {
            if (err) { res.send(`${err}`) }
            else if (updatedPet) {
                console.log(updatedPet);
                res.send(updatedPet)
            }
        })
}

const returnPet = (req, res) => {
    console.log("return",req.params.id);
    const petId = req.params.id
    Pet.findOneAndUpdate(
        // finding the doc
        { _id: ObjectId(petId) },
        // update the doc - req.body
        {
            ownerId: 0,
            status: "Available"
        },
        // options
        { new: true, useFindAndModify: false },
        (err, updatedPet) => {
            if (err) { res.send(err) }
            else {res.send(updatedPet)}
        })
}

const fosterPet = (req, res) => {
    // console.log(req.params.id, req.body);
    const petId = req.params.id
    const userId = req.body.user
    Pet.findOneAndUpdate(
        // finding the doc
        { _id: ObjectId(petId) },
        // update the doc - req.body
        {
            ownerId: ObjectId(userId),
            status: "Fostered"
        },
        // options
        { new: true, useFindAndModify: false },
        (err, updatedPet) => {
            if (err) { res.send(err) }
            else {res.send(updatedPet)}
        })
}



module.exports = {
    getPetById,
    // deletePetById, 
    updatePetById,
    getPets, addNewPet, adoptPet, returnPet, fosterPet
}