const express = require('express')
const app = express()
const port = 5000
const fs = require('fs')
const multer = require('multer')
const cors = require('cors')
const path = require("path")
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())

const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, './images') },
    filename: function (req, file, cb) { cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) }
})
const upload = multer({ storage: storage })


app.post("/admin/add-pet", upload.single("image"), (req, res) => {
    const pets = fs.readFileSync("./data.json", 'utf8', (err, data) => {
        if (err) throw err
        return data
    })
    const parsed = JSON.parse(pets)
    req.body["image"] = req.file.filename
    req.body["id"] = 
    parsed.pets.push(req.body)
    fs.writeFile("./data.json", JSON.stringify(parsed), (err) => {
        if (err) throw err
    })
    res.send('Pet added to database')
    console.log(parsed);
});

app.get('/', (req, res) => {
    const data = fs.readFileSync("./data.json", 'utf8', (err, data) => {
        if (err) throw err;
        else { return data }
    })
    // const {userData,petData} = fs.readFileSync("./data.json", 'utf8', (err, data) => {
    //     if (err) throw err;
    //     else { return data }
    // })
    // const userData = fs.readFileSync('users.json', 'utf8', (err, data) => {
    //     if (err) throw err;
    //     else { return data }
    // })
    // const dataObj = { users: userData, pets: petData }
    res.send(data)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})