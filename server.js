const express = require('express')
const app = express()
const port = 5000
const cors = require("cors")
const petRouter = require("./routs/petRouter");
const userRouter = require("./routs/usersRouter")
// const fs = require('fs')
// const multer = require('multer')
// const path = require("path")
// const jwt = require('jsonwebtoken')
// const bodyParser = require('body-parser')
// // const { MongoClient, ObjectID } = require("mongodb");
// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//     cloud_name: 'pet-image-cloud',
//     api_key: '477269894866243',
//     api_secret: '8c5bqcREahOR6ulEUbraisngmDY'
// });





app.use(cors())
app.use(express.json())
app.use('/api/pets', petRouter)
app.use('/api/users', userRouter)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) { cb(null, './images') },
//     filename: function (req, file, cb) { cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) }
// })
// const upload = multer({ storage: storage })

// const mongoose = require('mongoose');
// const url = "mongodb+srv://Ram:Ct9!7HSWeE@npVB@cluster0.ezysc.mongodb.net/petAdoptionProject?retryWrites=true&w=majority";
// const db = mongoose.connection;
// const Pet = require("./schemas/petSchema")
// db.collection("pets")
// db.collection("users")

// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//     console.log("server2 connected to mongo");   
// });

// app.use(express.static(path.join(__dirname)));
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use("/styles", express.static(__dirname));