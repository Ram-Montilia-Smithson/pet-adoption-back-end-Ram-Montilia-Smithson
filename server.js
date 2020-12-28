const express = require('express')
const app = express()
const port = 5000
// const fs = require('fs')
// const multer = require('multer')
// const cors = require('cors')
const path = require("path")
// const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')



app.use("/styles", express.static(__dirname));
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(cors())
app.use(express.json())

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) { cb(null, './images') },
//     filename: function (req, file, cb) { cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) }
// })
// const upload = multer({ storage: storage })

const userRouter = require("./routs/usersRouter")
// const petsRouter = require("./routes/petsRouter")


const { MongoClient, ObjectID } = require("mongodb");

const url = "mongodb+srv://Ram:Ct9!7HSWeE@npVB@cluster0.ezysc.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(url, { useUnifiedTopology: true });
const dbName = "petAdoptionProject";
let users_collection = "users";

client.connect().then((response) => {
    if (response.topology.s.state) {
        console.log("Status: " + response.topology.s.state);
        const db = client.db(dbName);
        // Use the collection named "users"
        users_collection = db.collection("users");
    } else {
        console.log("Problem connecting to MongoDB");
    }
});

app.get("/", (req, res) => {
    try {
        // Get all users from Mongo
        all_db_users = users_collection
            .find()
            .toArray()
            .then((users) => {
                console.log(users);
                res.send(users);
            });
    } catch (err) {
        res.send(
            `We have error: ${err.stack}. Sorry. We appreciate your patience while we work this out.`
        );
    }
});

// app.get('/', (req, res) => {res.send('Hello World!')})

app.use('/search', userRouter)

// app.use('/api/pets',petsRouter)

// app.post("/admin/add-pet", upload.single("image"), (req, res) => {
//     // }    
//     // if (err) throw err
//     //     return data
//     // }   
//     const parsed = JSON.parse(pets)
//     req.body
//     fs.writeFile("./data.json", JSON.stringify(parsed), (err) => {
//         if (err) throw err
//     })
//     res.send('Pet added to database')
// });

// app.get('/', (req, res) => {
    
// })

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})