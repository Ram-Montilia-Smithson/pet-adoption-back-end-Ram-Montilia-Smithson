const express = require('express')
const app = express()
const cors = require("cors")
const petRouter = require("./routs/petRouter");
const userRouter = require("./routs/usersRouter")
const multer = require('multer')
// const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
// const { auth } = require("express-openid-connect");
// const cookieParser = require('cookie-parser');
// const withAuth = require('./midle');
// const bcrypt = require("bcrypt")
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
app.use(bodyParser.urlencoded({ extended: true })) //this is different in the auth example
// app.use(auth({secret: process.env.SESSION_SECRET}))
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
app.use('/api/pets', upload.single('image'), petRouter)
app.use('/api/users', userRouter)

// app.get('/checkToken', withAuth, function (req, res) {
    // res.sendStatus(200);
// });

// app.get('/api/secret', withAuth, function (req, res) {
//     res.send('The password is potato');
// });

// process.on('warning', (warning) => {
//     console.log(warning.stack);
// });


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})