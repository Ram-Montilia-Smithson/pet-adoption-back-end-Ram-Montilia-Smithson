const express = require('express')
const app = express()
const cors = require("cors")
const petRouter = require("./routs/petRouter");
const userRouter = require("./routs/usersRouter")
const bodyParser = require('body-parser')
require("dotenv").config();
const port = process.env.port || 6000
const url = process.env.MONGO_CONNECTION_STRING ;

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://Ram:<password>@cluster0.ezysc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api/pets', petRouter)
app.use('/api/users', userRouter)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})