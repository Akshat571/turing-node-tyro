const express = require("express");
const router = express.Router();
const controller = require("../controllers/articleController");
const { tokenAuthenticator } = require("../utils");
const StatusCodes = require('http-status-codes').StatusCodes;
const notificationController = require("../controllers/notificationController");
const e = require("express");

router.post('/createPost', function (req, res) {
    const { title, topics, content } = req.body;
    if (title != (null || undefined) && content != (null || undefined) && topics != (null || undefined) && topics.length > 0) {
        tokenAuthenticator(req, res, function (error, verifiedJwt) {
            if (error) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    "error": { message: "UNAUTHORIZED" }
                })
            } else {
                var author = verifiedJwt.email;
                controller.publishPost(title, topics, content, author, function (error, article) {
                    if (error) {
                        return res.status(StatusCodes.BAD_REQUEST).json({
                            "error": { message: "BADREQUEST " }
                        })
                    } else {
                        notificationController.saveTopicNotification(article, function (error, notification) {
                            if (error) {
                                return res.status(StatusCodes.OK).json({
                                    error: {
                                        "message": error
                                    }
                                })
                            } else {
                                return res.status(StatusCodes.CREATED).json({
                                    result: {
                                        "message": "post published"
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    } else {
        res.status(StatusCodes.NO_CONTENT).json({
            "error": { message: "NO_CONTENT" }
        });
    }
})

router.get("/trending", function (req, res) {
    tokenAuthenticator(req, res, function (error, verifiedJwt) {
        if (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "error": { message: "UNAUTHORIZED" }
            })
        } else {
            controller.retriveTrendingArticles(function (error, articles) {
                if (error) {
                    return res.json({
                        error: {
                            message: error.name
                        }
                    })
                } else
                    res.send(articles);
            })
        }
    })
})

router.get("/feed", function (req, res) {
    tokenAuthenticator(req, res, function (error, verifiedJwt) {
        if (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "error": { message: "UNAUTHORIZED" }
            })
        } else {
            controller.retriveFeed(verifiedJwt.email, function (error, feedArr) {
                if (error) {
                    return res.json({
                        error: {
                            message: error.name
                        }
                    })
                } else
                    res.send(feedArr);
            })
        }
    })
})

router.put("/view/:id", function (req, res) {
    var articleId = req.params.id;
    tokenAuthenticator(req, res, function (error, verifiedJwt) {
        if (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "error": { message: "UNAUTHORIZED" }
            })
        } else {
            controller.viewArticle(articleId, function (error, result) {
                if (error) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        "error": error
                    })
                } else {
                    return res.status(StatusCodes.OK).json({
                        result: {
                            "message": "Increased views for the article"
                        }
                    })
                }
            })
        }
    })
})

router.put("/like/:id", function (req, res) {
    var articleId = req.params.id;
    tokenAuthenticator(req, res, function (error, verifiedJwt) {
        if (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "error": { message: "UNAUTHORIZED" }
            })
        } else {
            var userEmail = verifiedJwt.email;
            controller.likeArticle(userEmail, articleId, function (error, result) {
                if (error) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        "error": error
                    })
                } else if (result == null) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        error: {
                            "message": "Already liked the article"
                        }
                    })
                } else {
                    return res.status(StatusCodes.OK).json({
                        result: {
                            "message": "Liked this article"
                        }
                    })
                }
            })
        }
    })

})


router.put("/unlike/:id", function (req, res) {
    var articleId = req.params.id;
    tokenAuthenticator(req, res, function (error, verifiedJwt) {
        if (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "error": { message: "UNAUTHORIZED" }
            })
        } else {
            var userEmail = verifiedJwt.email;
            controller.unlikeArticle(userEmail, articleId, function (error, result) {
                if (error) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        "error": error
                    })
                } else if (result == null) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        error: {
                            "message": "Already unliked the article"
                        }
                    })
                } else {
                    return res.status(StatusCodes.OK).json({
                        result: {
                            "message": "UnLiked this article"
                        }
                    })
                }
            })
        }
    })

})

router.get('/read/:id', function (req, res) {
    var articleId = req.params.id;
    tokenAuthenticator(req, res, function (error, verifiedJwt) {
        if (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "error": { message: "UNAUTHORIZED" }
            })
        } else {
            var userEmail = verifiedJwt.email;
            controller.readArticle(userEmail, articleId, function (error, article) {
                if (error) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        "error": error
                    })
                } else {
                    return res.status(StatusCodes.OK).json({
                        "result": article
                    })

                }
            })
        }
    })
})

module.exports = router;