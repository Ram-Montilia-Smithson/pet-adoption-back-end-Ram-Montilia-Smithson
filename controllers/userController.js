// import User from "../models/user"

const User = require("../models/user");

const { isEmpty } = require("../utils/helper")


const getUsers = (req, res) => {
    const queryParams = req.query;
    const user = new User()
    const userList = isEmpty(queryParams) ? user.findAll() : user.findByParams(queryParams)
    res.json(userList);
}

const getUserById = (req, res) => {
    const user = new User()
    const user2 = user.findById(req.params.id)
    res.json(user2);
}

const deleteUserById = (req, res) => {
    const { id } = req.params;

    const user = new User()
    const userList = user.deleteById(id)

    res.json(userList);
}

const addNewUser = (req, res) => {
    const newUser = req.body;
    const user = new User()
    const userList = user.add(newUser)

    res.json(userList);
}

const updateUserById = (req, res) => {
    const { id } = req.params;
    const newUserInfo = req.body;
    const user = new User()
    const userList = user.updateById(id, newUserInfo)

    res.json(userList);
}

module.exports = { getUserById, deleteUserById, addNewUser, updateUserById, getUsers }