const express = require("express");
const router = express.Router();
const controller = require("../controllers/topicController");
const { handleResponse, getPayload, verifyToken } = require("../utils");
const StatusCodes = require('http-status-codes').StatusCodes;
const { tokenAuthenticator} = require("../utils");

// /topics/?count=? (numeric value)
router.get("/", (req, res) => {
    tokenAuthenticator(req, res, function (error, verifiedJwt) {
        if (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "error": { message: "UNAUTHORIZED" }
            })
        } else {
            let count = req.query.count;
            let email = verifiedJwt.email;
            controller.retriveTopicsByCount(count, email, function (topicError, topics) {
                if (topicError) {
                    res.send({
                        error: topicError.name
                    })
                } else {
                    res.send(topics);
                }
            })
        }
    })
})

module.exports = router;









