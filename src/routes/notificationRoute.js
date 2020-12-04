const express = require("express");
const router = express.Router();
const { tokenAuthenticator } = require("../utils");
const StatusCodes = require('http-status-codes').StatusCodes;
const controller = require('../controllers/notificationController')

router.get('/', (req, res) => {
    tokenAuthenticator(req, res, function (error, verifiedJwt) {
        if (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: { message: "UNAUTHORIZED" }
            })
        } else {
            controller.retriveAllNotifications(verifiedJwt.email, function (error, notifications) {
                if (error) {
                    return res.status(StatusCodes.UNAUTHORIZED).json({
                        result: {
                            "message": error.name
                        }
                    })
                } else {
                    res.send(notifications);
                }
            })
        }
    })
})

module.exports = router;