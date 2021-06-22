const express = require('express')
const multer = require("multer");
const router = express.Router()
const fileUpload = multer({ dest: 'uploads/' })

const { getPetById,
    // deletePetById,
    updatePetById, getPets, addNewPet, adoptPet, returnPet, fosterPet } = require("../controllers/petController")

router.get("/", getPets);

router.get("/:id", getPetById);

// router.delete("/:id", deletePetById);

router.post("/", fileUpload.single("image"), addNewPet);

router.put("/:id", fileUpload.single("image"), updatePetById);

router.put("/adopt/:id", adoptPet);

router.put("/return/:id", returnPet)

router.put("/foster/:id", fosterPet)

module.exports = router;