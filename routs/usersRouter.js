
const express = require('express')
const router = express.Router()

const {
    // getUserById, deleteUserById,
    updateUserById, isAuthenticated, addNewUser, getUsers, login, savedPets } = require("../controllers/userController")

router.get("/",
    // isAuthenticated,
    getUsers);

// router.get("/:id", getUserById);

// router.delete("/:id", deleteUserById);

router.post("/signup", express.json(), addNewUser);

router.post('/auth', express.json(), isAuthenticated);

router.put("/:id", updateUserById);

router.post("/login", login)

router.put("/save/:id", savedPets)

module.exports = router;