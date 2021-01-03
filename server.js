const express = require('express')
const app = express()
const port = 5000
const cors = require("cors")
const petRouter = require("./routs/petRouter");
const userRouter = require("./routs/usersRouter")
const fs = require('fs')
const multer = require('multer')
// const path = require("path")
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const url = "mongodb+srv://Ram:Ct9!7HSWeE@npVB@cluster0.ezysc.mongodb.net/petAdoptionProject?retryWrites=true&w=majority";
const db = mongoose.connection;
const Pet = require("./schemas/petSchema")
const User = require('./schemas/userSchema');
// const { auth } = require("express-openid-connect");
const cookieParser = require('cookie-parser');
// const withAuth = require('./midle');
const bcrypt = require("bcrypt")
const secret = 'mysecretsshhh';


app.use(cors())
app.use(express.json())
app.use('/api/pets', petRouter)
app.use('/api/users', userRouter)
app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) //this is different in the auth example
// app.use(auth({secret: process.env.SESSION_SECRET}))

cloudinary.config({
    cloud_name: 'pet-image-cloud',
    api_key: '477269894866243',
    api_secret: '8c5bqcREahOR6ulEUbraisngmDY'
    // CLOUDINARY_URL=cloudinary://477269894866243:8c5bqcREahOR6ulEUbraisngmDY@pet-image-cloud
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("file",file, "req", req);
        cb(null, './images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({storage})

db.collection("pets")
db.collection("users")

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("server connected to mongo");   
});

// works
app.post("/addPet", upload.single("image"), (req, res) => {
    // console.log("req-file-path",req.file.path);
    const path = req.file.path
    cloudinary.uploader.upload(
        path,
        { public_id: `pet-adoption-images/${req.body.name}-${new Date()}` },
        function (err, image) {
            if (err) { res.send(err) }
            else {
                console.log('image uploaded to Cloudinary')
                fs.unlinkSync(path)
                const newPet = req.body;
                const pet = new Pet(newPet)
                pet.image = image.secure_url
                pet.save((function (err, pet) {
                    if (err) { console.error(err) }
                    else {console.log("pet saved successfully", pet)}
                }))
            }
        }
    )
    res.send('Pet Added')
})

// POST route to register a user - check if works
app.post('/api/register', function (req, res) {
    const { email, password } = req.body;
    const user = new User({ email, password });
    user.save(function (err) {
        if (err) {
            res.status(500)
                .send("Error registering new user please try again.");
        } else {
            res.status(200).send("Welcome to the club!");
        }
    });
});


// not working - login no good
app.post('/login', function (req, res) {
    const { email, password } = req.body;
    User.findOne({ email: email }, function (err, user) {
        if (err) {console.error(err);res.status(500).json({error: 'error connecting to mongo please try again'});}
        else if (!user) { res.status(401).json({ error: 'Cannot find user' }) }
        user.isCorrectPassword(password, user.password, function (err, same) {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'Internal error please try again' });
            }
            else if (!same) {res.status(401).json({error: 'Incorrect email or password'});}
            else {
                // Issue token
                const payload = { email };
                const token = jwt.sign(payload, secret, {expiresIn: '1h'});
                res.cookie('token', token, { httpOnly: true }).sendStatus(200);
            }
        });
    })
})

app.post("/users", async function (req, res) {
    
})


// process.on('warning', (warning) => {
//     console.log(warning.stack);
// });


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})


// app.use(express.static(path.join(__dirname)));
// app.use("/styles", express.static(__dirname));
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "pug");
// app.use(express.static(path.join(__dirname, "..", "public")));
// app.use(
//     auth({
//         issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
//         baseURL: process.env.BASE_URL,
//         clientID: process.env.AUTH0_CLIENT_ID,
//         secret: process.env.SESSION_SECRET,
//         authRequired: false,
//         auth0Logout: true,
//     })
// );

// app.get('/checkToken', withAuth, function (req, res) {
    // res.sendStatus(200);
// });

// app.get('/api/secret', withAuth, function (req, res) {
//     res.send('The password is potato');
// });