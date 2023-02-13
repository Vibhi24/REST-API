const AppError = require("./AppError")
const sendErrorResponse = (error, req, res) => {
    res.status(500).json({
        message: error.message || "Some internal error",
    });
};
module.exports = sendErrorResponse;