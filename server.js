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
app.use('/api/pets', petRouter)
app.use('/api/users', userRouter)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})