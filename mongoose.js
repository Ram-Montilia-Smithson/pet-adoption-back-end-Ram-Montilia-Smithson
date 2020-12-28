const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose');
const url = "mongodb+srv://Ram:Ct9!7HSWeE@npVB@cluster0.ezysc.mongodb.net/test?retryWrites=true&w=majority";
const db = mongoose.connection;
db.name = "test"
db.collection("pets")
const petSchema = new mongoose.Schema({
    name: String,
    type: String
});
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    const Pet = mongoose.model('Pet', petSchema);
    const koko = new Pet({ name: 'koko', type: "cat" });
    // koko.save(function (err, koko) {
    //     if (err) return console.error(err);
    // //     console.log(koko, "line 46")
    // });
    // Pet.find(function (err, pets) {
    //     if (err) return console.error(err);
    //     console.log(pets, "line 50");
    // })
});


app.get("/", (req, res) => {
    try {
        pets = db.collections.pets.name
            .find()
            .toArray()
            .then((pets) => {
                console.log(pets);
                res.json(pets);
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