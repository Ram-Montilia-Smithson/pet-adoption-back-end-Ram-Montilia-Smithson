
const express = require('express')
const router = express.Router()

const { getUserById, deleteUserById, updateUserById, addNewUser, getUsers, login, savedPets } = require("../controllers/userController")

router.get("/", getUsers);

router.get("/:id", getUserById);

router.delete("/:id", deleteUserById);

router.post("/signup", addNewUser);

router.put("/:id", updateUserById);

router.post("/login", login)

router.put("/save/:id", savedPets)

module.exports = router;