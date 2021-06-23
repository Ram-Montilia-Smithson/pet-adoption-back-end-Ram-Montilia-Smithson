const express = require('express')
const multer = require("multer");
const router = express.Router()
const fileUpload = multer({ dest: 'uploads/' })

const { getPetById, deletePetById, isAuthenticated, updatePetById, getPets, addNewPet, adoptPet, returnPet, fosterPet } = require("../controllers/petController")

router.get("/", isAuthenticated, getPets);

router.get("/:id", getPetById);

router.delete("/:id/:name", deletePetById);

router.post("/", fileUpload.single("image"), addNewPet);

router.put("/:id", fileUpload.single("image"), isAuthenticated, updatePetById);

router.put("/adopt/:id", isAuthenticated, adoptPet);

router.put("/return/:id", isAuthenticated, returnPet)

router.put("/foster/:id", isAuthenticated, fosterPet)

module.exports = router;