const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const { handleResponse, tokenAuthenticator } = require("../utils");
const StatusCodes = require('http-status-codes').StatusCodes;

// /users/?count=? (Numeric value)
router.get("/", (req, res) => {
  tokenAuthenticator(req, res, function (error, verifiedJwt) {
    if (error) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: { message: "UNAUTHORIZED" }
      })
    } else {
      let count = req.query.count;
      var userEmail=verifiedJwt.email;
      controller.retriveUserByCount(count,userEmail, function (userError, userArr) {
        if (userError) {
          res.send({
            userError: userError.name
          })
        } else {
          res.send(userArr);
        }
      })
    }
  })
})

module.exports = router;