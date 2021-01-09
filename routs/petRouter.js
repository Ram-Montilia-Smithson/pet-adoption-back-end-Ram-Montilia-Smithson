const express = require('express')
const router = express.Router()

const { getPetById, deletePetById, updatePetById, getPets, addNewPet, adoptPet, returnPet, fosterPet } = require("../controllers/petController")

router.get("/", getPets);

router.get("/:id", getPetById);

router.delete("/:id", deletePetById);

router.post("/", addNewPet);

router.put("/:id", updatePetById);

router.put("/adopt/:id", adoptPet);

router.put("/return/:id", returnPet)

router.put("/foster/:id", fosterPet)

module.exports = router;