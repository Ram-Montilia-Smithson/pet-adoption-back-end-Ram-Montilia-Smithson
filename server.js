const express = require('express')
const app = express()
const port = 5000
// const fs = require('fs')
// const multer = require('multer')
const cors = require('cors')
// const path = require("path")
// const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) { cb(null, './images') },
//     filename: function (req, file, cb) { cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) }
// })
// const upload = multer({ storage: storage })

const userRouter = require("./routs/usersRouter")
// const petsRouter = require("./routes/petsRouter")


app.get('/', (req, res) => {res.send('Hello World!')})

app.use('/api/users', userRouter)

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