const express = require("express");
const router = express.Router();
const controller = require("../controllers/topicController");
const { handleResponse, getPayload, verifyToken } = require("../utils");
const StatusCodes = require('http-status-codes').StatusCodes;
const { tokenAuthenticator } = require("../utils");

router.get('/autocomplete/:topic', function (req, res) {
    const topic = req.params.topic;
    controller.getSimilarTopics(topic, function (error, result) {
        handleResponse(error, result, res);
    });

})

router.put('/follow/:id', function (req, res) {
    const topicId = req.params.id;
    if (topicId != null) {
        tokenAuthenticator(req, res, function (error, verifiedJwt) {
            if (error) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    "error": { message: "UNAUTHORIZED" }
                })
            } else {
                var userEmail = verifiedJwt.email;
                controller.followTopic(topicId, userEmail, function (error, result) {
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

router.put('/unfollow/:id', function (req, res) {
    const topicId = req.params.id;
    if (topicId != null) {
        tokenAuthenticator(req, res, function (error, verifiedJwt) {
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


module.exports = router;
