const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const url = "mongodb+srv://Ram:Ct9!7HSWeE@npVB@cluster0.ezysc.mongodb.net/petAdoptionProject?retryWrites=true&w=majority";
const db = mongoose.connection;
const User = require("../schemas/userSchema");
db.collection("users")

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connectede successfully user controller")
});

// works
const getUsers = async (req, res) => {
    User.find(function (err, users) {
        if (err) return console.error(err);
        res.send(users);
    })
}

// works
const addNewUser = (req, res) => {
    const newUser = req.body;
    const user = new User(newUser)
    user.save((function (err, user) {
        if (err) return console.error(err);
        console.log(user, "addNewUser");
    }))
    res.send(newUser)
}

// works
const getUserById = async (req, res) => {
    const userId = req.params.id
    console.log(userId, "userId");
    User.findOne({ _id: ObjectId(userId) }, function (err, foundUserById) {
        if (err) return console.log(err);
        res.send(foundUserById);
    })
}

// works
const deleteUserById = (req, res) => {
    const userId = req.params.id
    User.deleteOne({ _id: ObjectId(userId) }, function (err, deletedUserById) {
        if (err) { res.send(err) }
        else if (deletedUserById.n === 0) { res.send("no user was deleted") }
        else {
            const message = `the user with the id of ${userId} was deleted`
            res.send(message)
        }
    })
}

// not working
const updateUserById = (req, res) => {
    const userId = req.params.id
    User.updateOne({ _id: ObjectId(userId) }, function (err, updatedUserById) {
        if (err) { res.send(err) }
        console.log(updatedUserById);
    })    
}

module.exports = { getUserById, deleteUserById, addNewUser, updateUserById, getUsers }