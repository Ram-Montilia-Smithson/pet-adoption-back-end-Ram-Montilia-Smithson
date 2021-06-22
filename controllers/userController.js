const { ObjectId } = require('mongodb');
require("dotenv").config();
const url = process.env.MONGO_CONNECTION_STRING ;
const User = require("../schemas/userSchema");
const bcrypt = require("bcrypt")
const mongoose = require('mongoose');
const db = mongoose.connection;
const jwt = require('jsonwebtoken')
db.collection("users")

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useCreateIndex', true);
const tokenMaxAge = 3 * 24 * 60 * 60;
const cookieMaxAge = tokenMaxAge * 1000;
const authCookieOptions = { maxAge: cookieMaxAge, httpOnly: true };

const createToken = (uid) => {
    return jwt.sign({ uid }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: tokenMaxAge })
}


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connectede successfully user controller")
});

const getUsers = async (req, res) => {
    // console.log("hhh");
    User.find((err, users) => {
        if (err) res.send('error connecting to mongo please try again')
        else if (users) { res.json(users) }
    })
}

const isAuthenticated = (req, res, next) => {
    const token = verifyToken(req);
    if (token) {
        console.log("verified");
        return next();
    }
    res.status(401).send('Unauthorized');
}

const verifyToken = (req) => {
    // console.log(req.cookies);
    const token = req.cookies.auth;
    let dToken = null;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
            if (!err) {
                dToken = decodedToken;
            }
        })
    }
    return dToken;
}

const login = async (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email }, async (err, user) => {
        if (err) { res.send('error connecting to mongo please try again')}
        else if (!user) { res.send('Cannot find user')}
        else {
            if (await bcrypt.compare(password, user.password)) {
                const token = createToken(user._id);
                res.cookie('auth', token, authCookieOptions);
                res.json(user);
            }
            else { res.send('Incorrect email or password')}
        }
    })
}

const addNewUser = (req, res) => {
    const { email } = req.body;
    User.findOne({ email: email }, async (err, user) => {
        if (err) res.send(`${err}`);
        else if (user) { res.send("user already exist") }
        else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            req.body.password = hashedPassword
            const newUser = req.body
            const user = new User(newUser)
            user.save(((err, user) => {
                if (err) res.send(`${err}`)
                else {
                    const token = createToken(user._id);
                    res.cookie('auth', token, authCookieOptions);
                    console.log(user);
                    res.json(user);
                 }    
            }))
        }
    })
}

// works - not used
const getUserById = async (req, res) => {
    const userId = req.params.id
    User.findOne({ _id: ObjectId(userId) }, function (err, foundUserById) {
        if (err) return console.log(err);
        res.send(foundUserById);
    })
}

// works - not used
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

// 
const updateUserById = (req, res) => {
    if (req.body.email) {
        const { email } = req.body;
        const userId = req.params.id
        User.findOne({ email: email }, async (err, user) => {
            if (err) { res.send(`${err}, error connecting to mongo please try again`); }
            else if (user) {
                if (user._id != req.params.id) { res.send('email already exist'); }
                else if (user._id == req.params.id) {
                    // hashing the new password
                    const hashedPassword = await bcrypt.hash(req.body.password, 10)
                    req.body.password = hashedPassword
                    User.findOneAndUpdate(
                        // finding the doc
                        { _id: ObjectId(userId) },
                        // update the doc - req.body
                        req.body,
                        // options
                        { new: true, useFindAndModify: false },
                        (err, updatedUser) => {
                            if (err) res.send(`${err}, user was not updated, please try again`)
                            else { res.json(updatedUser) }
                        }
                        )
                        .catch(err => res.send(`${err}`))
                    }
            }
            else if (user == null) {
                // hashing the new password
                const hashedPassword = await bcrypt.hash(req.body.password, 10)
                req.body.password = hashedPassword
                User.findOneAndUpdate(
                    // finding the doc
                    { _id: ObjectId(userId) },
                    // update the doc - req.body
                    req.body,
                    // options
                    { new: true, useFindAndModify: false },
                    (err, updatedUser) => {
                        if (err) res.send(`${err}, user was not updated, please try again`)
                        else if (updatedUser == null) res.send(`err, user was not updated, please try again`)
                        else { res.json(updatedUser) }
                    }
                )
            }
            })
    }
}

const savedPets = async (req, res) => {
    const userId = req.params.id
    User.findOneAndUpdate(
        // finding the doc
        { _id: ObjectId(userId) },
        // update the doc - req.body
        req.body, 
        // options
        { new: true, useFindAndModify: false },
        (err, updatedUser) => {
            if (err) { console.log(err); res.send(`${err}, pet save failed, please try again`) }
            else {res.json(updatedUser)} 
        }
    )
}

module.exports = {
    isAuthenticated,
    getUserById, deleteUserById, addNewUser, updateUserById, getUsers, login, savedPets
}