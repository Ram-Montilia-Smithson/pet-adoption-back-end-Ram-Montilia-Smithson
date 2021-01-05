const express = require('express')
const router = express.Router()

const { getPetById, deletePetById, updatePetById, getPets, addNewPet } = require("../controllers/petController")

router.get("/", getPets);

router.get("/:id", getPetById);

router.delete("/:id", deletePetById);

router.post("/", addNewPet);

router.put("/:id", updatePetById);

module.exports = router;