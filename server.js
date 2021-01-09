const express = require('express')
const app = express()
const cors = require("cors")
const petRouter = require("./routs/petRouter");
const userRouter = require("./routs/usersRouter")
const multer = require('multer')
const bodyParser = require('body-parser')
require("dotenv").config();
const port = process.env.port || 5000

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("file", file, "req", req);
        cb(null, './images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api/pets', upload.single('image'), petRouter)
app.use('/api/users', userRouter)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})