class AppError extends Error {
    constructor({ message, statusCode}) {
        super(),
        this.message = message,
        this.statusCode = this.statusCode
    }
}
module.exports = AppError