const express = require('express')
const app = express()
const cors = require("cors")
const petRouter = require("./routs/petRouter");
const userRouter = require("./routs/usersRouter")
const cookieParser = require('cookie-parser');
require("dotenv").config();
const port = process.env.port || 6000
app.use(cors())
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Expose-Headers','Authorization');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
app.use('/api/pets', petRouter)
app.use('/api/users', userRouter)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})