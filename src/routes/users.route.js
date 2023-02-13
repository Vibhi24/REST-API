const express = require("express");
const { getAllUsers, createUser, getUserById, deleteUserById, updateUserById, validateUser, validateUpdateUserData } = require("../controllers/users.controller");
const router = express.Router();

router.route("").get(getAllUsers).post(validateUser, createUser);
router.route("/:id").get(getUserById).delete(deleteUserById).put(validateUpdateUserData, updateUserById);

module.exports = router;