const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const controller = require("../controllers/topicController");
const { handleResponse, getPayload, verifyToken } = require("../utils");
const StatusCodes = require('http-status-codes').StatusCodes;
const { tokenAuthincator } = require("../utils");

router.get('/autocomplete/:topic', function (req, res) {
    const topic = req.params.topic;
    controller.getSimilarTopics(topic, function (error, result) {
        handleResponse(error, result, res);
    });

})

router.get('/follow/:id', function (req, res) {
    const topicId = req.params.id;
    if (topicId != null) {
        tokenAuthincator(req, res, function (error, verifiedJwt) {
            if (error) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    message: "UNAUTHORIZED"
                })
            } else {
                var userEmail = verifiedJwt.email;
                controller.followTopic(topicId, userEmail, function (error, result) {
                    if (error) {
                        res.status(StatusCodes.BAD_REQUEST)
                    } else {
                        res.status(StatusCodes.OK)
                        result={"success":{
                            "message":"Follow successful"
                        }}
                    }
                    handleResponse(error, result, res);
                })

            }
        })

    } else {
        return res.status(StatusCodes.NO_CONTENT).json({
            message: "NO CONTENT"
        });
    }

})
module.exports = router;
