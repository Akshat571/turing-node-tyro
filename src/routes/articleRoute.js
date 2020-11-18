const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const controller = require("../controllers/articleController");
const { handleResponse, getPayload, verifyToken } = require("../utils");
const StatusCodes = require('http-status-codes').StatusCodes;

router.post('/createPost', function (req, res) {
    const { title, topics, content } = req.body;
    if (title != null && content != null && topics != null) {
        const bearerHeader = req.headers['authorization'];
        if (bearerHeader == null || bearerHeader == undefined) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "BAD REQUEST"
            })
            return;
        }
        var token = getPayload(bearerHeader);
        if (token == null) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "BAD REQUEST"
            })
            return;
        } else {
            verifyToken(token, function (error, verifiedJwt) {
                console.log("verified token-->", verifiedJwt);
                if (error) {
                    return res.status(StatusCodes.UNAUTHORIZED).json({
                        message: "UNAUTHORIZED"
                    })
                } else {
                    var author = verifiedJwt.email;
                    controller.publishPost(title, topics, content, author, function (error, article) {
                        if (error) {
                            res.status(StatusCodes.BAD_REQUEST).json({
                                "message": error.name
                            })
                            return;

                        } else {
                            return res.status(StatusCodes.OK).json({
                                result: {
                                    "message": "post published"
                                }
                            })
                        }
                    })

                }
            })
        }

    } else {
        res.status(StatusCodes.NO_CONTENT).json({
            "message": "NO CONTENT"
        });
    }
})

module.exports = router;