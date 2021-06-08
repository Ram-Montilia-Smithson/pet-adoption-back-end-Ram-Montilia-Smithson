const express = require('express')
const multer = require("multer");
const router = express.Router()
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './images')
    },
    filename: function(req, file, cb) {
      console.log(file)
      cb(null, file.originalname)
    }
  })

const upload = multer({ storage });


const { getPetById, deletePetById, updatePetById, getPets, addNewPet, adoptPet, returnPet, fosterPet } = require("../controllers/petController")

router.get("/", getPets);

router.get("/:id", getPetById);

router.delete("/:id", deletePetById);

router.post("/", express.json(), upload.single("image"), addNewPet);

router.put("/:id", updatePetById);

router.put("/adopt/:id", adoptPet);

router.put("/return/:id", returnPet)

router.put("/foster/:id", fosterPet)

module.exports = router;