
const express = require('express')
const router = express.Router()

const { getUserById, deleteUserById, updateUserById, isAuthenticated, addNewUser, getUsers, login, savedPets } = require("../controllers/userController")

router.get("/", isAuthenticated, getUsers);

router.get("/:id", isAuthenticated, getUserById);

router.delete("/:id/:name", isAuthenticated, deleteUserById);

router.post("/signup", express.json(), addNewUser);

router.post('/auth', express.json(), isAuthenticated);

router.put("/:id", isAuthenticated, updateUserById);

router.post("/login", login)

router.put("/save/:id", isAuthenticated, savedPets)

module.exports = router;