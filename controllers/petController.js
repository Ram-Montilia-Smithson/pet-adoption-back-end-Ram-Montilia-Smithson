const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const url = "mongodb+srv://Ram:Ct9!7HSWeE@npVB@cluster0.ezysc.mongodb.net/petAdoptionProject?retryWrites=true&w=majority";
const db = mongoose.connection;
const Pet = require("../schemas/petSchema")
const cloudinary = require('cloudinary').v2;
const fs = require('fs')
require("dotenv").config();
db.collection("pets")
const jwt = require('jsonwebtoken')
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useCreateIndex', true);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log("connected successfully pet controller")});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const isAuthenticated = (req, res, next) => {
    const token = verifyToken(req);
    if (token) return next();
    res.status(401).send('Unauthorized');
}

const verifyToken = (req) => {
    const token = req.cookies.auth;
    let dToken = null;
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
            if (!err) dToken = decodedToken;
        })
    }
    return dToken;
}

const getPets = (req, res) => {
    Pet.find((err, pets) => {
        if (err) res.send('error connecting to mongo please try again')
        else if (pets) res.json(pets)
    })
}

const addNewPet = (req, res) => {
    const path = req.file.path
    cloudinary.uploader.upload(
        path,
        { public_id: `pet-adoption-images/${req.body.name}-${new Date().toISOString()}` },
        (err, image) => {
            if (err) res.status(500).send(err)
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
    Pet.findOne({_id: ObjectId(petId)} ,(err, foundPetById) => {
        if (err) res.send(`${err} error connecting to mongo please try again`)
        else if (!foundPetById) res.send("didn't find pet")
        else if (foundPetById) res.json(foundPetById);
    })
}

const deletePetById = (req, res) => {
    const petId = req.params.id
    const petName = req.params.name
    Pet.deleteOne({ _id: ObjectId(petId) }, (err, deletedPetById) => {
        if (err) res.send(`${err} error connecting to mongo please try again`)
        else if (deletedPetById.n === 0) res.send("pet not found, no pet was deleted")
        else res.send(`the pet ${petName} was deleted`)
    })
}

const adoptPet = (req, res) => {
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
            if (err) res.send(`${err}`)
            else if (updatedPet) res.send(updatedPet)
        })
}

const returnPet = (req, res) => {
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
            if (err) res.send(err)
            else res.send(updatedPet)
        })
}

const fosterPet = (req, res) => {
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
            if (err) res.send(err)
            else res.send(updatedPet)
        })
}



module.exports = { getPetById, isAuthenticated, updatePetById, getPets, addNewPet, adoptPet, returnPet, fosterPet, deletePetById,}