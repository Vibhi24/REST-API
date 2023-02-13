const User = require("../model/User.model");
const sendResponse = require("../helpers/sendResponse")
const sendErrorResponse = require("../helpers/sendErrorResponse");
const AppError = require("../helpers/AppError");
const readPromise = require("../helpers/readFile");
const fs = require("fs");
const path = "./data/users.json";


const getAllUsers = (req, res) => {
    readPromise(path)
        .then((users) => {
            return JSON.parse(users)
        })
        .then((users) => {
            return sendResponse(req, res, {
                statusCode: 200,
                message: "Fetched user data Successfully",
                payload: users
            })
        })
        .catch(() => {
            sendErrorResponse(new AppError("Cannot read file", 500), req, res);
        })
}

const getUserById = (req, res) => {
    const id = req.params.id;
    readPromise(path)
        .then((users) => {
            return JSON.parse(users)
        })
        .then((users) => {
            const user = users.find((user) => user.id === id);
            if (user) {
                sendResponse(req, res, {
                    statusCode: 200,
                    message: "User found",
                    payload: user
                })
            }
            return sendErrorResponse(new AppError({ message: "User not found", statusCode: 404 }), req, res);
        })
        .catch(() => {
            sendErrorResponse(new AppError("Cannot read file", 500), req, res);
        })
}

const validateUser = (req, res, next) => {
    const { body } = req;
    const validKeys = ["id", "name", "profileImage", "introduction", "profileLink"];

    const result = validKeys.every((key) => Object.keys(body).includes(key))

    if (!result) {
        return sendErrorResponse(new AppError({ message: "Invalid request body", statusCode: 422 }), req, res);
    }
    next();
}

const createUser = (req, res) => {
    readPromise(path)
        .then((users) => {
            return JSON.parse(users)
        })
        .then((users) => {
            const { body } = req;
            const user = users.find((user) => user.id === body.id);
            if (user) {
                return sendErrorResponse(new AppError({ message: "User with this Id already exists", statusCode: 400 }), req, res);
            }

            const newUser = new User(body);
            users.push(req.body);

            fs.writeFile("./data/users.json", JSON.stringify(users), "utf-8", (err) => {
                if (err) {
                    console.log(err);
                    return sendErrorResponse(new AppError({ message: err, statusCode: 400 }), req, res);
                }
                else {
                    return sendResponse(req, res, {
                        statusCode: 200,
                        message: "User added successfully",
                        payload: newUser
                    })
                }
            });
        })
        .catch((err) => {
            sendErrorResponse(new AppError("Cannot read file", 500), req, res);
        })
}

const validateUpdateUserData = (req, res, next) => {
    const { body } = req;
    const validKeys = ["name", "profileImage", "introduction", "profileLink"];

    const result = validKeys.every((key) => Object.keys(body).includes(key))

    if (!result) {
        return sendErrorResponse(new AppError({ message: "Invalid request body", statusCode: 422 }), req, res);
    }
    next();
}

const updateUserById = (req, res) => {
    const id = req.params.id;
    const { body } = req;

    readPromise(path)
        .then((users) => {
            return JSON.parse(users)
        })
        .then((users) => {
            const user = users.find((user) => user.id === id);
            if (!user) {
                return sendErrorResponse(new AppError({ message: "User does not exist", statusCode: 404 }), req, res);
            }
            Object.keys(body).forEach((key) => user[key] = body[key]);

            try {
                fs.writeFile('./data/users.json', JSON.stringify(users), "utf-8", (err) => {
                    if (err) {
                        return sendErrorResponse(new AppError({ message: `Cannot write file due to : ${err}`, statusCode: 500 }), req, res);
                    }
                    else {
                        return sendResponse(req, res, {
                            statusCode: 200,
                            message: "User updated Successfully",
                            payload: user
                        })
                    }
                })
            }
            catch (err) {
                console.log(err);
                return sendErrorResponse(new AppError({ message: `Cannot write file due to Error : ${err}`, statusCode: 500 }))
            }
        })
        .catch((err) => {
            sendErrorResponse(new AppError("Cannot read file", 500), req, res);
        })
}

const deleteUserById = (req, res) => {
    readPromise(path)
        .then((users) => {
            return JSON.parse(users);
        })
        .then((users) => {
            const index = users.findIndex((ele) => ele.id === req.params.id);
            if (index !== -1) {
                users.splice(index, 1);
                try {
                    fs.writeFile("./data/users.json", JSON.stringify(users), (err) => {
                        if (err) {
                            console.log(err)
                            return sendErrorResponse(new AppError({ message: err, statusCode: 400 }), req, res);
                        }
                        else {
                            return sendResponse(req, res, {
                                statusCode: 200,
                                message: "User deleted",
                                payload: [users]
                            })
                        }
                    });
                }
                catch (err) {
                    return sendErrorResponse(new AppError({ message: `Cannot write file due to Error : ${err}`, statusCode: 404 }), req, res);
                }
            }
        })
        .catch((err) => {
            sendErrorResponse(new AppError("Cannot read file", 500), req, res);
        })
}

module.exports = { getAllUsers, getUserById, createUser, validateUpdateUserData, updateUserById, deleteUserById, validateUser }