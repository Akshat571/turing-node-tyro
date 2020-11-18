const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const controller = require("../controllers/topicController");
const { handleResponse, getPayload, verifyToken } = require("../utils");
const StatusCodes = require('http-status-codes').StatusCodes;

router.get('/autocomplete/:topic', function (req, res) {
    const topic = req.params.topic;
    console.log("here-->",topic);
    controller.getSimilarTopics(topic, function (error, result) {
        handleResponse(error, result, res);
    });

})
module.exports = router;