const express = require('express')
const app = express()
const port = 5000
const cors = require("cors")
const petRouter = require("./routs/usersRouter");
// const fs = require('fs')
// const multer = require('multer')
// const path = require("path")
// const jwt = require('jsonwebtoken')
// const bodyParser = require('body-parser')
// const { MongoClient, ObjectID } = require("mongodb");


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) { cb(null, './images') },
//     filename: function (req, file, cb) { cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) }
// })
// const upload = multer({ storage: storage })

const mongoose = require('mongoose');
const url = "mongodb+srv://Ram:Ct9!7HSWeE@npVB@cluster0.ezysc.mongodb.net/petAdoptionProject?retryWrites=true&w=majority";
const db = mongoose.connection;
const Pet = require("./schemas/petSchema")
db.collection("pets")
db.collection("users")

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // const koko = new Pet({ name: 'koko', type: "cat" });
    // console.log(koko);
       
});

app.use(cors())
app.use(express.json())
app.use("/styles", express.static(__dirname));
app.use("/api/pets", petRouter)
// app.use(express.static(path.join(__dirname)));
// app.use(bodyParser.urlencoded({ extended: true }))

app.post("/addPet", (req, res) => {
    try {
        const newPet = req.body
        const newPetSchema = new Pet(newPet)
        newPetSchema.save(function (err, newPetSchema) {
            console.log(newPetSchema)
        })
        res.send(newPet)
    } catch (err) {
        res.send(
            `We have error: ${err.stack}. Sorry. We appreciate your patience while we work this out.`
        );
    }
});

app.get("/", (req, res) => {
    try {
        users = db.collections.users
            .find()
            .toArray()
            .then((users) => {
                // console.log(users, "app.get (users)");
                res.json(users)
            });
    } catch (err) {
        res.send(
            `We have error: ${err.stack}. Sorry. We appreciate your patience while we work this out.`
        );
    }
});

app.get("/", (req, res) => {
    try {
        pets = db.collections.pets
            .find()
            .toArray()
            .then((pets) => {
                // console.log(pets, "app.get (pets)");
                res.json(pets)
            });
    } catch (err) {
        res.send(
            `We have error: ${err.stack}. Sorry. We appreciate your patience while we work this out.`
        );
    }
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})