const sendResponse = (req, res, configObj) => {
    const {statusCode, message, payload} = configObj;
    res.status(statusCode || 200).json({
        message: message,
        data:payload
    })
};
module.exports = sendResponse;