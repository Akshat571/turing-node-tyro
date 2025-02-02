const express = require("express");
const router = express.Router();
const controller = require("../controllers/bookmarkController");
const { tokenAuthenticator } = require("../utils");
const StatusCodes = require('http-status-codes').StatusCodes;


router.put("/add/:id", function (req, res) {
    var articleId = req.params.id;
    tokenAuthenticator(req, res, function (error, verifiedJwt) {
        if (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "error": { message: "UNAUTHORIZED" }
            })
        } else {
            var userEmail = verifiedJwt.email;
            controller.addBookMark(userEmail, articleId, function (error, result) {
                if (error) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        "error": error
                    })
                } else if (result == null) {
                   return  res.status(StatusCodes.BAD_REQUEST).json({
                        error: {
                            "message": "Already book marked the article"
                        }
                    })
                } else {
                    return res.status(StatusCodes.OK).json({
                        result: {
                            "message": "Bookmarked this article"
                        }
                    })
                }
            })
        }
    })

})

router.put("/remove/:id", function (req, res) {
    var articleId = req.params.id;
    tokenAuthenticator(req, res, function (error, verifiedJwt) {
        if (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "error": { message: "UNAUTHORIZED" }
            })
        } else {
            var userEmail = verifiedJwt.email;
            controller.removeBookmark(userEmail, articleId, function (error, result) {
                if (error) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        "error": error
                    })
                }  else {
                    return res.status(StatusCodes.OK).json({
                        result: {
                            "message": "Article is no longer bookmarked"
                        }
                    })
                }
            })
        }
    })

})

router.get("/", function (req, res) {
    tokenAuthenticator(req, res, function (error, verifiedJwt) {
        if (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "error": { message: "UNAUTHORIZED" }
            })
        } else {
            controller.retriveAllBookmarkedArticles(verifiedJwt.email, function (error, articles) {
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


module.exports = router;