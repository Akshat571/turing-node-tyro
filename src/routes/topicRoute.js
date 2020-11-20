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
                    "error": { message: "UNAUTHORIZED" }
                })
            } else {
                var userEmail = verifiedJwt.email;
                controller.followTopic(topicId, userEmail, function (error, result) {
                    console.log(result);
                    if (error) {
                        res.status(StatusCodes.BAD_REQUEST)
                    } else if (result == null) {
                        res.status(StatusCodes.BAD_REQUEST)
                        result = {
                            "error": {
                                "message": "Already following"
                            }
                        }
                    } else {
                        res.status(StatusCodes.OK)
                        result = {
                            "result": {
                                "message": "Follow successful"
                            }
                        }
                    }
                    handleResponse(error, result, res);
                })

            }
        })
    } else {
        return res.status(StatusCodes.NO_CONTENT).json({
            "error": { message: "NO_CONTENT" }
        });
    }

})

router.get('/unfollow/:id', function (req, res) {
    const topicId = req.params.id;
    if (topicId != null) {
        tokenAuthincator(req, res, function (error, verifiedJwt) {
            if (error) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    "error": { message: "UNAUTHORIZED" }
                })
            } else {
                var userEmail = verifiedJwt.email;
                controller.unfollowTopic(topicId, userEmail, function (error, result) {

                    if (error) {
                        res.status(StatusCodes.BAD_REQUEST)
                    } else {
                        res.status(StatusCodes.OK)
                        result = {
                            "result": {
                                "message": "Unfollow successful"
                            }
                        }
                    }
                    handleResponse(error, result, res);
                })

            }
        })

    } else {
        return res.status(StatusCodes.NO_CONTENT).json({
            "error": { message: "NO_CONTENT" }
        });
    }

})

router.get("/:count?", (req, res) => {
    tokenAuthincator(req, res, function (error, verifiedJwt) {
        if (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "error": { message: "UNAUTHORIZED" }
            })
        } else {
            let count = req.params.count;
            controller.retriveTopicsByCount(count, function (topicError, topics) {
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
