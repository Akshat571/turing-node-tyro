const express = require("express");
const router = express.Router();
const controller = require("../controllers/articleController");
const { tokenAuthincator } = require("../utils");
const StatusCodes = require('http-status-codes').StatusCodes;

router.post('/createPost', function (req, res) {
    const { title, topics, content } = req.body;
    if (title != null && content != null && topics != null) {
        tokenAuthincator(req, res, function (error, verifiedJwt) {
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
                        return res.status(StatusCodes.CREATED).json({
                            result: {
                                "message": "post published"
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
    tokenAuthincator(req, res, function (error, verifiedJwt) {
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
    tokenAuthincator(req, res, function (error, verifiedJwt) {
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

router.put("/view/:id",function(req,res){
    var articleId=req.params.id;
    tokenAuthincator(req, res, function (error, verifiedJwt) {
        if (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "error": { message: "UNAUTHORIZED" }
            })
        } else {
            controller.viewArticle(articleId,function(error,result){
                if (error) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        "error":error
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

module.exports = router;