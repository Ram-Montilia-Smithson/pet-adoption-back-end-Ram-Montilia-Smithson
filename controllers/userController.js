const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const url = process.env.MONGO_CONNECTION_STRING ;
const db = mongoose.connection;
const User = require("../schemas/userSchema");
const bcrypt = require("bcrypt")

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

const login = async (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email }, function (err, user) {
        if (err) { console.error(err); res.status(500).json({ error: 'error connecting to mongo please try again' }); }
        else if (!user) { res.status(401).json({ error: 'Cannot find user' }) }
        else {
            console.log("password", password, "userPassword", user.password);
            if (password !== user.password) { res.status(401).json({ error: 'Incorrect email or password' }) }
            else {
                // Issue token
                // const payload = { email };
                // const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
                // res.cookie('token', token, { httpOnly: true }).sendStatus(200);
                res.status(200).send(user)
                console.log(user);
            }
        }
    })
}

// works with no bcrypt
// { console.error(err); res.status(500).json({ error: 'error connecting to mongo please try again' }); }
const addNewUser = async (req, res) => {
    const { email } = req.body;
    User.findOne({ email: email }, function (err, user) {
        if (err) return console.error(err);
        else if (user) { res.status(422).json({ error: 'user already exist' }) }
        else {
            // const hashedPassword = await bcrypt.hash(req.body.password, 10)
            // console.log("hashedpassword", hashedPassword)
            // req.body.password = hashedPassword
            const newUser = req.body
            const user = new User(newUser)
            user.save((function (err, user) {
                if (err) return console.error(err)
                // else{}
                console.log(user, "addNewUser")
            }))
            res.status(201).send(newUser)    
        }
    })
}

// works
const getUserById = async (req, res) => {
    const userId = req.params.id
    // console.log(userId, "userId");
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
            console.log(res);
            const message = `the user with the id of ${userId} was deleted`
            res.send(message)
        }
        // 
        console.log(deletedUserById);
        // 
    })
}

// works
const updateUserById = (req, res) => {
    // let newUserInfo = {}
    // for (const property in req.body) {
    //     { newUserInfo[property] = req.body[property] };
    // }
    console.log("req.body",req.body);
    if (req.body.email) {
        const { email } = req.body;
        User.findOne({ email: email }, function (err, user) {
            if (err) { console.error(err); res.status(500).json({ error: 'error connecting to mongo please try again' }); }
            else if (user) { res.status(422).json({ error: 'email already exist' }) }
        })
    }
    console.log("req.params.id", req.params.id);
    const userId = req.params.id
    User.findOneAndUpdate(
        // finding the doc
        { _id: ObjectId(userId) },
        // update the doc - req.body
        req.body,
        // options
        { new: true, useFindAndModify: false },
        // cb
        function (err, updatedUser) {
            if (err) { console.error(err); res.status(500).json({ error: `user ${user.firstName} was not updated, please try again` }); }
            else {
                console.log(updatedUser);
                res.status(200).send(updatedUser)
            }
        }
    )
}

module.exports = { getUserById, deleteUserById, addNewUser, updateUserById, getUsers, login }