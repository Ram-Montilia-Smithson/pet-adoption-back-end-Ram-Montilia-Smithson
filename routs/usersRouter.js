
const express = require('express')
const router = express.Router()

const { getUserById, deleteUserById, updateUserById, addNewUser, getUsers } = require("../controllers/userController")

router.get("/", getUsers);

router.get("/:id", getUserById);

router.delete("/:id", deleteUserById);

router.post("/", addNewUser);

router.put("/:id", updateUserById);

module.exports = router;