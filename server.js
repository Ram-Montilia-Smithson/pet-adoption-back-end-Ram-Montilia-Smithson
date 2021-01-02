const express = require('express')
const app = express()
const port = 5000
const cors = require("cors")
const petRouter = require("./routs/petRouter");
const userRouter = require("./routs/usersRouter")
const fs = require('fs')
const multer = require('multer')
// const path = require("path")
// const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const url = "mongodb+srv://Ram:Ct9!7HSWeE@npVB@cluster0.ezysc.mongodb.net/petAdoptionProject?retryWrites=true&w=majority";
const db = mongoose.connection;
const Pet = require("./schemas/petSchema")


app.use(cors())
app.use(express.json())
app.use('/api/pets', petRouter)
app.use('/api/users', userRouter)
// app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }))
// app.use("/styles", express.static(__dirname));


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

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("server connected to mongo");   
});

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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})